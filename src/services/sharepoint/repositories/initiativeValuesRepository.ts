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
import {
  createManyForInitiative as createKpiValues,
  deleteByInitiativeId as deleteKpiValues,
  listByInitiativeId as listKpiValues,
} from '../lists/kpiValuesListApi'

const getYear = (monthRef: string): number => Number(monthRef.split('-')[0])

export const initiativeValuesRepository = {
  async getKpiValuesByInitiativeId(initiativeId: InitiativeId): Promise<readonly SaveKpiValueDto[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    const items = await listKpiValues(sharePointInitiativeId)
    return items.map(fromSharePointKpiValue)
  },

  async replaceKpiValuesByInitiativeId(initiativeId: InitiativeId, values: readonly SaveKpiValueDto[]): Promise<void> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    await deleteKpiValues(sharePointInitiativeId)

    if (values.length === 0) {
      return
    }

    await createKpiValues(sharePointInitiativeId, values.map(toCreateKpiValuePayload))
  },

  async getComponentFixedValuesByInitiativeId(initiativeId: InitiativeId): Promise<readonly SaveComponentValueDto[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    const items = await listComponentValues(sharePointInitiativeId)
    return items.map(fromSharePointComponentValue)
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

    await createComponentValues(sharePointInitiativeId, values.map(toCreateComponentValuePayload))
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
