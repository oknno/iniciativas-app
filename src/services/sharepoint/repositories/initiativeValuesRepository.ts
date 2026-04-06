import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'
import {
  fromSharePointComponentValue,
  fromSharePointKpiValue,
  initiativeIdToSharePoint,
  toCreateComponentValuePayload,
  toCreateKpiValuePayload,
} from '../adapters/sharePointInitiativeAdapter'
import {
  createManyForInitiative as createComponentValues,
  deleteByInitiativeId as deleteComponentValues,
  listByInitiativeId as listComponentValues,
} from '../lists/componentValuesListApi'
import { listAll as listComponentCatalog } from '../lists/componentMasterListApi'
import {
  createManyForInitiative as createKpiValues,
  deleteByInitiativeId as deleteKpiValues,
  listByInitiativeId as listKpiValues,
} from '../lists/kpiValuesListApi'
import { listAll as listKpiCatalog } from '../lists/kpiMasterListApi'

const getYear = (monthRef: string): number => Number(monthRef.split('-')[0])

const loadCatalogMaps = async (): Promise<{
  readonly componentTypeIdByCode: Readonly<Record<string, number>>
  readonly componentTypeById: Readonly<Record<number, string>>
  readonly kpiIdByCode: Readonly<Record<string, number>>
  readonly kpiCodeById: Readonly<Record<number, string>>
}> => {
  const [components, kpis] = await Promise.all([listComponentCatalog(), listKpiCatalog()])

  return {
    componentTypeIdByCode: components.reduce<Record<string, number>>((acc, item) => {
      acc[item.ComponentType] = item.Id
      return acc
    }, {}),
    componentTypeById: components.reduce<Record<number, string>>((acc, item) => {
      acc[item.Id] = item.ComponentType
      return acc
    }, {}),
    kpiIdByCode: kpis.reduce<Record<string, number>>((acc, item) => {
      acc[item.KPICode] = item.Id
      return acc
    }, {}),
    kpiCodeById: kpis.reduce<Record<number, string>>((acc, item) => {
      acc[item.Id] = item.KPICode
      return acc
    }, {}),
  }
}

const requireCatalogId = (map: Readonly<Record<string, number>>, code: string, fieldName: string): number => {
  const value = map[code]
  if (!Number.isInteger(value)) {
    throw new Error(`Unable to resolve ${fieldName} code '${code}' to SharePoint lookup id.`)
  }

  return value
}

export const initiativeValuesRepository = {
  async getKpiValuesByInitiativeId(initiativeId: InitiativeId): Promise<readonly SaveKpiValueDto[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    const [items, maps] = await Promise.all([listKpiValues(sharePointInitiativeId), loadCatalogMaps()])
    return items.map((item) => fromSharePointKpiValue(item, { componentTypeById: maps.componentTypeById, kpiCodeById: maps.kpiCodeById }))
  },

  async replaceKpiValuesByInitiativeId(initiativeId: InitiativeId, values: readonly SaveKpiValueDto[]): Promise<void> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    await deleteKpiValues(sharePointInitiativeId)

    if (values.length === 0) {
      return
    }

    const maps = await loadCatalogMaps()

    await createKpiValues(
      sharePointInitiativeId,
      values.map((value) =>
        toCreateKpiValuePayload(value, {
          kpiCodeId: requireCatalogId(maps.kpiIdByCode, value.kpiCode, 'KPICode'),
          componentTypeId: value.componentId ? requireCatalogId(maps.componentTypeIdByCode, value.componentId, 'ComponentType') : undefined,
        }),
      ),
    )
  },

  async getComponentFixedValuesByInitiativeId(initiativeId: InitiativeId): Promise<readonly SaveComponentValueDto[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    const [items, maps] = await Promise.all([listComponentValues(sharePointInitiativeId), loadCatalogMaps()])
    return items.map((item) => fromSharePointComponentValue(item, { componentTypeById: maps.componentTypeById }))
  },

  async replaceComponentFixedValuesByInitiativeId(
    initiativeId: InitiativeId,
    values: readonly SaveComponentValueDto[],
  ): Promise<void> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    await deleteComponentValues(sharePointInitiativeId)

    if (values.length === 0) {
      return
    }

    const maps = await loadCatalogMaps()

    await createComponentValues(
      sharePointInitiativeId,
      values.map((value) =>
        toCreateComponentValuePayload(value, {
          componentTypeId: requireCatalogId(maps.componentTypeIdByCode, value.componentId, 'ComponentType'),
        }),
      ),
    )
  },

  async listByInitiativeYearScenario(
    initiativeId: InitiativeId,
    year: number,
    scenario: Scenario,
  ): Promise<{ readonly kpiValues: readonly SaveKpiValueDto[]; readonly componentValues: readonly SaveComponentValueDto[] }> {
    const [kpiValues, componentValues] = await Promise.all([
      this.getKpiValuesByInitiativeId(initiativeId),
      this.getComponentFixedValuesByInitiativeId(initiativeId),
    ])

    return {
      kpiValues: kpiValues.filter((item) => item.scenario === scenario && getYear(item.monthRef) === year),
      componentValues: componentValues.filter((item) => item.scenario === scenario && getYear(item.monthRef) === year),
    }
  },

  async saveKpiValues(values: readonly SaveKpiValueDto[]): Promise<void> {
    const initiativeId = values[0]?.initiativeId

    if (!initiativeId) {
      return
    }

    await this.replaceKpiValuesByInitiativeId(initiativeId, values)
  },

  async saveComponentValues(values: readonly SaveComponentValueDto[]): Promise<void> {
    const initiativeId = values[0]?.initiativeId

    if (!initiativeId) {
      return
    }

    await this.replaceComponentFixedValuesByInitiativeId(initiativeId, values)
  },
}
