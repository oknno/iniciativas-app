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

const toOptionalString = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
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

export const initiativeIdFromSharePoint = (id: number): InitiativeId => asInitiativeId(String(id))

export const initiativeIdToSharePoint = (initiativeId: InitiativeId): number => toSharePointInitiativeId(initiativeId)

export const fromSharePointInitiative = (
  item: InitiativeListItem,
  components: InitiativeWithAnnualGain['components'],
  annualGain: number,
): InitiativeWithAnnualGain => ({
  id: initiativeIdFromSharePoint(item.Id),
  code: item.Code,
  title: item.Title,
  description: toOptionalString(item.Description),
  owner: item.Owner,
  stage: item.Stage as InitiativeWithAnnualGain['stage'],
  status: item.Status as InitiativeWithAnnualGain['status'],
  scenario: item.Scenario as InitiativeWithAnnualGain['scenario'],
  implementationCost: Number(item.ImplementationCost),
  startMonthRef: item.StartMonthRef as InitiativeWithAnnualGain['startMonthRef'],
  endMonthRef: item.EndMonthRef as InitiativeWithAnnualGain['endMonthRef'],
  components,
  annualGain,
  createdAt: item.Created ?? '',
  updatedAt: item.Modified ?? '',
})

export const toCreateInitiativePayload = (input: SaveInitiativeDto): CreateInitiativePayload => ({
  Title: input.title,
  Code: input.code,
  Description: toOptionalString(input.description),
  Owner: input.owner,
  Stage: input.stage,
  Status: input.status,
  Scenario: input.scenario,
  ImplementationCost: input.implementationCost,
  StartMonthRef: input.startMonthRef,
  EndMonthRef: input.endMonthRef,
})

export const toUpdateInitiativePayload = (input: SaveInitiativeDto): UpdateInitiativePayload => ({
  Title: input.title,
  Code: input.code,
  Description: toOptionalString(input.description),
  Owner: input.owner,
  Stage: input.stage,
  Status: input.status,
  Scenario: input.scenario,
  ImplementationCost: input.implementationCost,
  StartMonthRef: input.startMonthRef,
  EndMonthRef: input.endMonthRef,
})

export const fromSharePointInitiativeComponent = (item: InitiativeComponentListItem): InitiativeWithAnnualGain['components'][number] => ({
  id: item.ComponentId ?? String(item.Id),
  initiativeId: initiativeIdFromSharePoint(item.InitiativeId),
  name: item.Title,
  componentType: item.ComponentType as InitiativeWithAnnualGain['components'][number]['componentType'],
  direction: item.Direction as InitiativeWithAnnualGain['components'][number]['direction'],
  calculationType: item.CalculationType as InitiativeWithAnnualGain['components'][number]['calculationType'],
  kpiCode: item.KpiCode ? asKpiCode(item.KpiCode) : undefined,
  conversionCode: item.ConversionCode ? asConversionCode(item.ConversionCode) : undefined,
  formulaCode: item.FormulaCode ? asFormulaCode(item.FormulaCode) : undefined,
  fixedValue: toOptionalNumber(item.FixedValue),
  sortOrder: item.SortOrder,
})

export const toCreateInitiativeComponentPayload = (
  input: SaveInitiativeComponentDto,
  sortOrder: number,
): Omit<CreateInitiativeComponentPayload, 'InitiativeId'> => ({
  ComponentId: input.id,
  Title: input.name,
  ComponentType: input.componentType,
  Direction: input.direction,
  CalculationType: input.calculationType,
  KpiCode: input.kpiCode,
  ConversionCode: input.conversionCode,
  FormulaCode: input.formulaCode,
  FixedValue: toOptionalNumber(input.fixedValue),
  SortOrder: sortOrder,
})

export const fromSharePointKpiValue = (item: KpiValueListItem): SaveKpiValueDto => ({
  initiativeId: initiativeIdFromSharePoint(item.InitiativeId),
  componentId: item.ComponentId,
  kpiCode: asKpiCode(item.KpiCode),
  monthRef: item.MonthRef as SaveKpiValueDto['monthRef'],
  scenario: item.Scenario as SaveKpiValueDto['scenario'],
  value: Number(item.Value),
})

export const toCreateKpiValuePayload = (value: SaveKpiValueDto): Omit<CreateKpiValuePayload, 'InitiativeId'> => ({
  ComponentId: value.componentId,
  KpiCode: value.kpiCode,
  MonthRef: value.monthRef,
  Scenario: value.scenario,
  Value: value.value,
})

export const fromSharePointComponentValue = (item: ComponentValueListItem): SaveComponentValueDto => ({
  initiativeId: initiativeIdFromSharePoint(item.InitiativeId),
  componentId: item.ComponentId,
  monthRef: item.MonthRef as SaveComponentValueDto['monthRef'],
  scenario: item.Scenario as SaveComponentValueDto['scenario'],
  baseValue: Number(item.BaseValue),
  direction: item.Direction as SaveComponentValueDto['direction'],
})

export const toCreateComponentValuePayload = (
  value: SaveComponentValueDto,
): Omit<CreateComponentValuePayload, 'InitiativeId'> => ({
  ComponentId: value.componentId,
  MonthRef: value.monthRef,
  Scenario: value.scenario,
  BaseValue: value.baseValue,
  Direction: value.direction,
})
