import type { SaveInitiativeComponentDto } from '../../../application/dto/initiatives/SaveInitiativeComponentDto'
import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import {
  fromSharePointInitiativeComponent,
  initiativeIdToSharePoint,
  toCreateInitiativeComponentPayload,
} from '../adapters/sharePointInitiativeAdapter'
import { listAll as listComponentCatalog } from '../lists/componentMasterListApi'
import { listAll as listConversionCatalog } from '../lists/conversionMasterListApi'
import { listAll as listFormulaCatalog } from '../lists/formulaMasterListApi'
import {
  createManyForInitiative,
  deleteByInitiativeId,
  listByInitiativeId,
} from '../lists/initiativeComponentsListApi'
import { listAll as listKpiCatalog } from '../lists/kpiMasterListApi'

const toIdCodeMaps = async (): Promise<{
  readonly componentTypeIdByCode: Readonly<Record<string, number>>
  readonly kpiIdByCode: Readonly<Record<string, number>>
  readonly conversionIdByCode: Readonly<Record<string, number>>
  readonly formulaIdByCode: Readonly<Record<string, number>>
  readonly componentTypeById: Readonly<Record<number, string>>
  readonly kpiCodeById: Readonly<Record<number, string>>
  readonly conversionCodeById: Readonly<Record<number, string>>
  readonly formulaCodeById: Readonly<Record<number, string>>
}> => {
  const [components, kpis, conversions, formulas] = await Promise.all([
    listComponentCatalog(),
    listKpiCatalog(),
    listConversionCatalog(),
    listFormulaCatalog(),
  ])

  return {
    componentTypeIdByCode: components.reduce<Record<string, number>>((acc, item) => {
      acc[item.ComponentType] = item.Id
      return acc
    }, {}),
    kpiIdByCode: kpis.reduce<Record<string, number>>((acc, item) => {
      acc[item.KPICode] = item.Id
      return acc
    }, {}),
    conversionIdByCode: conversions.reduce<Record<string, number>>((acc, item) => {
      acc[item.ConversionCode] = item.Id
      return acc
    }, {}),
    formulaIdByCode: formulas.reduce<Record<string, number>>((acc, item) => {
      acc[item.FormulaCode] = item.Id
      return acc
    }, {}),
    componentTypeById: components.reduce<Record<number, string>>((acc, item) => {
      acc[item.Id] = item.ComponentType
      return acc
    }, {}),
    kpiCodeById: kpis.reduce<Record<number, string>>((acc, item) => {
      acc[item.Id] = item.KPICode
      return acc
    }, {}),
    conversionCodeById: conversions.reduce<Record<number, string>>((acc, item) => {
      acc[item.Id] = item.ConversionCode
      return acc
    }, {}),
    formulaCodeById: formulas.reduce<Record<number, string>>((acc, item) => {
      acc[item.Id] = item.FormulaCode
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

export const initiativeComponentsRepository = {
  async listByInitiativeId(initiativeId: InitiativeId): Promise<readonly InitiativeComponent[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    const [items, maps] = await Promise.all([listByInitiativeId(sharePointInitiativeId), toIdCodeMaps()])

    return items.map((item) =>
      fromSharePointInitiativeComponent(item, {
        componentTypeById: maps.componentTypeById,
        kpiCodeById: maps.kpiCodeById,
        conversionCodeById: maps.conversionCodeById,
        formulaCodeById: maps.formulaCodeById,
      }),
    )
  },

  async replaceByInitiativeId(
    initiativeId: InitiativeId,
    components: readonly SaveInitiativeComponentDto[],
  ): Promise<readonly InitiativeComponent[]> {
    const sharePointInitiativeId = initiativeIdToSharePoint(initiativeId)
    await deleteByInitiativeId(sharePointInitiativeId)

    if (components.length === 0) {
      return []
    }

    const maps = await toIdCodeMaps()

    const payload = components
      .slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((component) =>
        toCreateInitiativeComponentPayload(component, {
          componentTypeId: requireCatalogId(maps.componentTypeIdByCode, component.componentType, 'ComponentType'),
          kpiCodeId: component.kpiCode ? requireCatalogId(maps.kpiIdByCode, component.kpiCode, 'KPICode') : undefined,
          conversionCodeId: component.conversionCode
            ? requireCatalogId(maps.conversionIdByCode, component.conversionCode, 'ConversionCode')
            : undefined,
          formulaCodeId: component.formulaCode
            ? requireCatalogId(maps.formulaIdByCode, component.formulaCode, 'FormulaCode')
            : undefined,
        }),
      )

    const created = await createManyForInitiative(sharePointInitiativeId, payload)
    return created.map((item) =>
      fromSharePointInitiativeComponent(item, {
        componentTypeById: maps.componentTypeById,
        kpiCodeById: maps.kpiCodeById,
        conversionCodeById: maps.conversionCodeById,
        formulaCodeById: maps.formulaCodeById,
      }),
    )
  },

  async saveByInitiativeId(
    initiativeId: InitiativeId,
    components: readonly SaveInitiativeComponentDto[],
  ): Promise<readonly InitiativeComponent[]> {
    return this.replaceByInitiativeId(initiativeId, components)
  },
}
