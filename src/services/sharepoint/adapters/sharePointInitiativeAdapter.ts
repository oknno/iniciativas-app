import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveInitiativeDto } from '../../../application/dto/initiatives/SaveInitiativeDto'
import type { SaveInitiativeComponentDto } from '../../../application/dto/initiatives/SaveInitiativeComponentDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'
import type { InitiativeWithAnnualGain } from '../../../application/mappers/initiatives/initiativeMappers'
import { asInitiativeId, type InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { CALCULATION_TYPES, type CalculationType } from '../../../domain/catalogs/value-objects/CalculationType'
import { asFormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { ComponentValueListItem, CreateComponentValuePayload } from '../lists/componentValuesListApi'
import type { InitiativeComponentListItem, CreateInitiativeComponentPayload } from '../lists/initiativeComponentsListApi'
import type { CreateInitiativePayload, InitiativeListItem, UpdateInitiativePayload } from '../lists/initiativesListApi'
import type { CreateKpiValuePayload, KpiValueListItem } from '../lists/kpiValuesListApi'

interface LookupObject {
  readonly Id?: number
  readonly Title?: string
  readonly ComponentType?: string
  readonly ComponentId?: string
  readonly KPICode?: string
  readonly ConversionCode?: string
  readonly FormulaCode?: string
}

type LookupLike = string | number | LookupObject | undefined | null

export interface SharePointCatalogCodeMaps {
  readonly componentTypeById?: Readonly<Record<number, string>>
  readonly kpiCodeById?: Readonly<Record<number, string>>
  readonly conversionCodeById?: Readonly<Record<number, string>>
  readonly formulaCodeById?: Readonly<Record<number, string>>
}

const toMonthRef = (year: number, month: number): SaveKpiValueDto['monthRef'] =>
  `${year}-${String(month).padStart(2, '0')}` as SaveKpiValueDto['monthRef']

const toYearMonth = (monthRef: string): { year: number; month: number } => {
  const [yearPart, monthPart] = monthRef.split('-')
  const year = Number(yearPart)
  const month = Number(monthPart)

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid month ref '${monthRef}'.`)
  }

  return { year, month }
}

const toOptionalNumber = (value: number | undefined): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined

const toDirection = (value: number | undefined): 1 | -1 => (value === -1 ? -1 : 1)
const toCalculationType = (value: string | undefined): CalculationType =>
  CALCULATION_TYPES.includes(value as CalculationType) ? (value as CalculationType) : 'FIXED'

const toInitiativeMonthTitle = (initiativeId: InitiativeId, year: number, month: number, suffix: string): string =>
  `INIT-${initiativeId}-${year}-${String(month).padStart(2, '0')}-${suffix}`

const toSharePointInitiativeId = (initiativeId: InitiativeId): number => {
  const parsed = Number(initiativeId)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid SharePoint initiative id '${initiativeId}'.`)
  }

  return parsed
}

const resolveLookupCode = (
  value: LookupLike,
  fieldName: string,
  itemId: number,
  codeField: keyof LookupObject,
  idMap?: Readonly<Record<number, string>>,
): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  if (!value || typeof value !== 'object') {
    return undefined
  }

  const codeCandidate = value[codeField]
  if (typeof codeCandidate === 'string' && codeCandidate.trim().length > 0) {
    return codeCandidate.trim()
  }

  if (typeof value.Id === 'number' && idMap) {
    const mapped = idMap[value.Id]
    if (mapped) {
      return mapped
    }
  }

  throw new Error(
    `${fieldName} is configured as lookup but did not return a resolvable code for item ${itemId}. Missing expanded '${String(codeField)}' or catalog mapping for id '${String(value.Id)}'.`,
  )
}

const resolveInitiativeId = (item: { readonly InitiativeId?: LookupLike; readonly InitiativeIdId?: number; readonly Id: number }): InitiativeId => {
  if (typeof item.InitiativeIdId === 'number') {
    return asInitiativeId(String(item.InitiativeIdId))
  }

  if (item.InitiativeId && typeof item.InitiativeId === 'object' && typeof item.InitiativeId.Id === 'number') {
    return asInitiativeId(String(item.InitiativeId.Id))
  }

  throw new Error(`InitiativeId is missing in SharePoint record ${item.Id}.`)
}

export const initiativeIdFromSharePoint = (id: number | string): InitiativeId => asInitiativeId(String(id))

export const initiativeIdToSharePoint = (initiativeId: InitiativeId): number => toSharePointInitiativeId(initiativeId)

export const fromSharePointInitiative = (
  item: InitiativeListItem,
  components: InitiativeWithAnnualGain['components'],
  annualGain: number,
): InitiativeWithAnnualGain => ({
  id: initiativeIdFromSharePoint(item.Id),
  title: item.Title,
  unidade: item.Unidade,
  responsavel: item.Responsavel,
  stage: item.Stage,
  status: item.Status,
  components,
  annualGain,
  createdAt: item.Created ?? '',
  updatedAt: item.Modified ?? '',
})

export const toCreateInitiativePayload = (input: SaveInitiativeDto): CreateInitiativePayload => ({
  Title: input.title,
  Unidade: input.unidade,
  Responsavel: input.responsavel,
  Stage: input.stage,
  Status: input.status,
})

export const toUpdateInitiativePayload = (input: SaveInitiativeDto): UpdateInitiativePayload => ({
  Title: input.title,
  Unidade: input.unidade,
  Responsavel: input.responsavel,
  Stage: input.stage,
  Status: input.status,
})

export const fromSharePointInitiativeComponent = (
  item: InitiativeComponentListItem,
  catalogMaps: SharePointCatalogCodeMaps = {},
): InitiativeWithAnnualGain['components'][number] => {
  const resolvedComponentType = resolveLookupCode(
    item.ComponentType,
    'ComponentType',
    item.Id,
    'ComponentType',
    catalogMaps.componentTypeById,
  )

  if (!resolvedComponentType) {
    throw new Error(`ComponentType is missing for initiative component ${item.Id}.`)
  }

  const resolvedKpiCode = resolveLookupCode(item.KPICode, 'KPICode', item.Id, 'KPICode', catalogMaps.kpiCodeById)
  const resolvedConversionCode = resolveLookupCode(
    item.ConversionCode,
    'ConversionCode',
    item.Id,
    'ConversionCode',
    catalogMaps.conversionCodeById,
  )
  const resolvedFormulaCode = resolveLookupCode(
    item.FormulaCode,
    'FormulaCode',
    item.Id,
    'FormulaCode',
    catalogMaps.formulaCodeById,
  )

  return {
    id: item.ComponentId ?? resolvedComponentType,
    initiativeId: resolveInitiativeId(item),
    name: item.Title ?? resolvedComponentType,
    componentType: resolvedComponentType as InitiativeWithAnnualGain['components'][number]['componentType'],
    direction: toDirection(item.Direction),
    calculationType: toCalculationType(item.CalculationType),
    kpiCode: resolvedKpiCode ? asKpiCode(resolvedKpiCode) : undefined,
    conversionCode: resolvedConversionCode ? asConversionCode(resolvedConversionCode) : undefined,
    formulaCode: resolvedFormulaCode ? asFormulaCode(resolvedFormulaCode) : undefined,
    fixedValue: undefined,
    sortOrder: item.SortOrder ?? item.Id,
  }
}

export const toCreateInitiativeComponentPayload = (
  input: SaveInitiativeComponentDto,
  references: {
    readonly componentTypeId: number
    readonly kpiCodeId?: number
    readonly conversionCodeId?: number
    readonly formulaCodeId?: number
  },
): Omit<CreateInitiativeComponentPayload, 'InitiativeIdId'> => ({
  ComponentId: input.id ?? input.componentType,
  Title: input.name,
  ComponentTypeId: references.componentTypeId,
  KPICodeId: references.kpiCodeId,
  ConversionCodeId: references.conversionCodeId,
  FormulaCodeId: references.formulaCodeId,
  Direction: input.direction,
  CalculationType: input.calculationType,
})

export const fromSharePointKpiValue = (item: KpiValueListItem, catalogMaps: SharePointCatalogCodeMaps = {}): SaveKpiValueDto => {
  const resolvedKpiCode = resolveLookupCode(item.KPICode, 'KPICode', item.Id, 'KPICode', catalogMaps.kpiCodeById)

  if (!resolvedKpiCode) {
    throw new Error(`KPICode is missing for KPI value ${item.Id}.`)
  }

  const resolvedComponentType = resolveLookupCode(
    item.ComponentType,
    'ComponentType',
    item.Id,
    'ComponentType',
    catalogMaps.componentTypeById,
  )

  return {
    initiativeId: resolveInitiativeId(item),
    componentId: resolvedComponentType ?? resolvedKpiCode,
    kpiCode: asKpiCode(resolvedKpiCode),
    monthRef: toMonthRef(item.Year, item.Month),
    scenario: (item.Scenario ?? 'BASE') as SaveKpiValueDto['scenario'],
    value: Number(item.Value),
  }
}

export const toCreateKpiValuePayload = (
  value: SaveKpiValueDto,
  references: { readonly kpiCodeId: number; readonly componentTypeId?: number },
): Omit<CreateKpiValuePayload, 'InitiativeIdId'> => {
  const { year, month } = toYearMonth(value.monthRef)

  return {
    Title: toInitiativeMonthTitle(value.initiativeId, year, month, value.kpiCode),
    KPICodeId: references.kpiCodeId,
    ComponentTypeId: references.componentTypeId,
    Year: year,
    Month: month,
    Value: value.value,
    Scenario: value.scenario,
  }
}

export const fromSharePointComponentValue = (
  item: ComponentValueListItem,
  catalogMaps: SharePointCatalogCodeMaps = {},
): SaveComponentValueDto => {
  const resolvedComponentType = resolveLookupCode(
    item.ComponentType,
    'ComponentType',
    item.Id,
    'ComponentType',
    catalogMaps.componentTypeById,
  )

  if (!resolvedComponentType) {
    throw new Error(`ComponentType is missing for component value ${item.Id}.`)
  }

  return {
    initiativeId: resolveInitiativeId(item),
    componentId: resolvedComponentType,
    monthRef: toMonthRef(item.Year, item.Month),
    scenario: 'BASE',
    baseValue: Number(item.Value),
    direction: 1,
  }
}

export const toCreateComponentValuePayload = (
  value: SaveComponentValueDto,
  references: { readonly componentTypeId: number },
): Omit<CreateComponentValuePayload, 'InitiativeIdId'> => {
  const { year, month } = toYearMonth(value.monthRef)

  return {
    Title: toInitiativeMonthTitle(value.initiativeId, year, month, value.componentId),
    ComponentTypeId: references.componentTypeId,
    Year: year,
    Month: month,
    Value: toOptionalNumber(value.baseValue) ?? 0,
  }
}
