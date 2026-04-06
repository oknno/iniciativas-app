import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveInitiativeDto } from '../../../application/dto/initiatives/SaveInitiativeDto'
import type { SaveInitiativeComponentDto } from '../../../application/dto/initiatives/SaveInitiativeComponentDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'
import type { InitiativeWithAnnualGain } from '../../../application/mappers/initiatives/initiativeMappers'
import { asInitiativeId, type InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { ComponentValueListItem, CreateComponentValuePayload } from '../lists/componentValuesListApi'
import type { InitiativeComponentListItem, CreateInitiativeComponentPayload } from '../lists/initiativeComponentsListApi'
import type { CreateInitiativePayload, InitiativeListItem, UpdateInitiativePayload } from '../lists/initiativesListApi'
import type { CreateKpiValuePayload, KpiValueListItem } from '../lists/kpiValuesListApi'

type LookupLike =
  | string
  | number
  | {
      readonly Id?: number
      readonly Title?: string
      readonly ComponentType?: string
      readonly ComponentId?: string
      readonly KPICode?: string
      readonly ConversionCode?: string
      readonly FormulaCode?: string
    }
  | undefined
  | null

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

const toInitiativeMonthTitle = (initiativeId: InitiativeId, year: number, month: number, suffix: string): string =>
  `INIT-${initiativeId}-${year}-${String(month).padStart(2, '0')}-${suffix}`

const toSharePointInitiativeId = (initiativeId: InitiativeId): number => {
  const parsed = Number(initiativeId)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid SharePoint initiative id '${initiativeId}'.`)
  }

  return parsed
}

const toLookupString = (value: LookupLike, fieldOrder: readonly string[]): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (!value || typeof value !== 'object') {
    return undefined
  }

  for (const field of fieldOrder) {
    const candidate = value[field as keyof typeof value]
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim()
    }
  }

  if (typeof value.Id === 'number') {
    return String(value.Id)
  }

  return undefined
}

const toCanonicalComponentType = (value: LookupLike): string | undefined =>
  toLookupString(value, ['ComponentType', 'ComponentId', 'Title'])

const resolveInitiativeId = (item: { readonly InitiativeId?: LookupLike; readonly InitiativeIdId?: number }): InitiativeId => {
  const fromNumeric = typeof item.InitiativeIdId === 'number' ? String(item.InitiativeIdId) : undefined
  const fromLookup = toLookupString(item.InitiativeId, ['Id'])
  const resolved = fromNumeric ?? fromLookup

  if (!resolved) {
    throw new Error('InitiativeId is missing in SharePoint record.')
  }

  return asInitiativeId(resolved)
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

export const fromSharePointInitiativeComponent = (item: InitiativeComponentListItem): InitiativeWithAnnualGain['components'][number] => {
  const resolvedComponentType = toCanonicalComponentType(item.ComponentType)

  if (!resolvedComponentType) {
    throw new Error(`ComponentType is missing for initiative component ${item.Id}.`)
  }

  const resolvedKpiCode = toLookupString(item.KPICode, ['KPICode', 'Title'])
  const resolvedConversionCode = toLookupString(item.ConversionCode, ['ConversionCode', 'Title'])
  const resolvedFormulaCode = toLookupString(item.FormulaCode, ['FormulaCode', 'Title'])

  console.log('[SharePointInitiativeAdapter] Resolved Initiative_Component row:', {
    itemId: item.Id,
    componentType: resolvedComponentType,
    kpiCode: resolvedKpiCode,
    conversionCode: resolvedConversionCode,
    formulaCode: resolvedFormulaCode,
  })

  return {
    id: item.ComponentId ?? resolvedComponentType,
    initiativeId: resolveInitiativeId(item),
    name: item.Title ?? resolvedComponentType,
    componentType: resolvedComponentType as InitiativeWithAnnualGain['components'][number]['componentType'],
    direction: 1,
    calculationType: 'FIXED',
    kpiCode: resolvedKpiCode ? asKpiCode(resolvedKpiCode) : undefined,
    conversionCode: resolvedConversionCode ? asConversionCode(resolvedConversionCode) : undefined,
    formulaCode: resolvedFormulaCode ? asFormulaCode(resolvedFormulaCode) : undefined,
    fixedValue: undefined,
    sortOrder: item.SortOrder ?? item.Id,
  }
}

export const toCreateInitiativeComponentPayload = (
  input: SaveInitiativeComponentDto,
): Omit<CreateInitiativeComponentPayload, 'InitiativeId'> => ({
  ComponentId: input.componentType,
  Title: input.componentType,
  ComponentType: input.componentType,
  KPICode: input.kpiCode,
  ConversionCode: input.conversionCode,
  FormulaCode: input.formulaCode,
})

export const fromSharePointKpiValue = (item: KpiValueListItem): SaveKpiValueDto => {
  const resolvedKpiCode = toLookupString(item.KPICode, ['KPICode', 'Title'])

  if (!resolvedKpiCode) {
    throw new Error(`KPICode is missing for KPI value ${item.Id}.`)
  }

  return {
    initiativeId: resolveInitiativeId(item),
    componentId: toCanonicalComponentType(item.ComponentType) ?? resolvedKpiCode,
    kpiCode: asKpiCode(resolvedKpiCode),
    monthRef: toMonthRef(item.Year, item.Month),
    scenario: (item.Scenario ?? 'BASE') as SaveKpiValueDto['scenario'],
    value: Number(item.Value),
  }
}

export const toCreateKpiValuePayload = (value: SaveKpiValueDto): Omit<CreateKpiValuePayload, 'InitiativeId'> => {
  const { year, month } = toYearMonth(value.monthRef)

  return {
    Title: toInitiativeMonthTitle(value.initiativeId, year, month, value.kpiCode),
    KPICode: value.kpiCode,
    ComponentType: value.componentId,
    Year: year,
    Month: month,
    Value: value.value,
    Scenario: value.scenario,
  }
}

export const fromSharePointComponentValue = (item: ComponentValueListItem): SaveComponentValueDto => ({
  initiativeId: resolveInitiativeId(item),
  componentId: toCanonicalComponentType(item.ComponentType) ?? '',
  monthRef: toMonthRef(item.Year, item.Month),
  scenario: 'BASE',
  baseValue: Number(item.Value),
  direction: 1,
})

export const toCreateComponentValuePayload = (
  value: SaveComponentValueDto,
): Omit<CreateComponentValuePayload, 'InitiativeId'> => {
  const { year, month } = toYearMonth(value.monthRef)

  return {
    Title: toInitiativeMonthTitle(value.initiativeId, year, month, value.componentId),
    ComponentType: value.componentId,
    Year: year,
    Month: month,
    Value: toOptionalNumber(value.baseValue) ?? 0,
  }
}
