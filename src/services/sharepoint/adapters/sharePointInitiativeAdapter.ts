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

const toSharePointInitiativeId = (initiativeId: InitiativeId): number => {
  const parsed = Number(initiativeId)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid SharePoint initiative id '${initiativeId}'.`)
  }

  return parsed
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

export const fromSharePointInitiativeComponent = (item: InitiativeComponentListItem): InitiativeWithAnnualGain['components'][number] => ({
  id: item.ComponentId ?? String(item.Id),
  initiativeId: initiativeIdFromSharePoint(item.InitiativeId),
  name: item.Title ?? item.ComponentType,
  componentType: item.ComponentType as InitiativeWithAnnualGain['components'][number]['componentType'],
  direction: 1,
  calculationType: item.KPICode ? 'KPI_BASED' : 'FIXED',
  kpiCode: item.KPICode ? asKpiCode(item.KPICode) : undefined,
  conversionCode: item.ConversionCode ? asConversionCode(item.ConversionCode) : undefined,
  formulaCode: item.FormulaCode ? asFormulaCode(item.FormulaCode) : undefined,
  fixedValue: undefined,
  sortOrder: item.Id,
})

export const toCreateInitiativeComponentPayload = (
  input: SaveInitiativeComponentDto,
): Omit<CreateInitiativeComponentPayload, 'InitiativeId'> => ({
  ComponentId: input.id,
  Title: input.name,
  ComponentType: input.componentType,
  KPICode: input.kpiCode,
  ConversionCode: input.conversionCode,
  FormulaCode: input.formulaCode,
})

export const fromSharePointKpiValue = (item: KpiValueListItem): SaveKpiValueDto => ({
  initiativeId: initiativeIdFromSharePoint(item.InitiativeId),
  componentId: item.KPICode,
  kpiCode: asKpiCode(item.KPICode),
  monthRef: toMonthRef(item.Year, item.Month),
  scenario: (item.Scenario ?? 'BASE') as SaveKpiValueDto['scenario'],
  value: Number(item.Value),
})

export const toCreateKpiValuePayload = (value: SaveKpiValueDto): Omit<CreateKpiValuePayload, 'InitiativeId'> => {
  const { year, month } = toYearMonth(value.monthRef)

  return {
    KPICode: value.kpiCode,
    Year: year,
    Month: month,
    Value: value.value,
    Scenario: value.scenario,
  }
}

export const fromSharePointComponentValue = (item: ComponentValueListItem): SaveComponentValueDto => ({
  initiativeId: initiativeIdFromSharePoint(item.InitiativeId),
  componentId: item.ComponentType,
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
    ComponentType: value.componentId,
    Year: year,
    Month: month,
    Value: toOptionalNumber(value.baseValue) ?? 0,
  }
}
