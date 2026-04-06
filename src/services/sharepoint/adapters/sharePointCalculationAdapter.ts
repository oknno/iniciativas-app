import type { CalculationDetail } from '../../../domain/calculation/entities/CalculationDetail'
import type { CalculationResult } from '../../../domain/calculation/entities/CalculationResult'
import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'
import type { CalculationDetailListItem, CreateCalculationDetailPayload } from '../lists/calculationDetailsListApi'
import type { CalculationResultListItem, CreateCalculationResultPayload } from '../lists/calculationResultsListApi'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import { asInitiativeId, type InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

export const initiativeIdFromSharePointCalculation = (id: number | string): InitiativeId => asInitiativeId(String(id))

const resolveInitiativeId = (
  item: { readonly InitiativeId: number | { readonly Id?: number }; readonly InitiativeIdId?: number },
): InitiativeId => {
  if (typeof item.InitiativeIdId === 'number') {
    return initiativeIdFromSharePointCalculation(item.InitiativeIdId)
  }

  if (typeof item.InitiativeId === 'number') {
    return initiativeIdFromSharePointCalculation(item.InitiativeId)
  }

  if (typeof item.InitiativeId === 'object' && typeof item.InitiativeId.Id === 'number') {
    return initiativeIdFromSharePointCalculation(item.InitiativeId.Id)
  }

  throw new Error('InitiativeId is missing in calculation record.')
}

export const initiativeIdToSharePointCalculation = (initiativeId: InitiativeId): number => {
  const parsed = Number(initiativeId)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid SharePoint initiative id '${initiativeId}'.`)
  }

  return parsed
}

export const fromSharePointCalculationResult = (item: CalculationResultListItem): CalculationResult => ({
  initiativeId: resolveInitiativeId(item),
  year: Number(item.Year),
  month: Number(item.Month),
  gainValue: Number(item.GainValue),
  accumulatedValue: item.AccumulatedValue !== undefined ? Number(item.AccumulatedValue) : undefined,
  annualValue: item.AnnualValue !== undefined ? Number(item.AnnualValue) : undefined,
})

export const fromSharePointCalculationDetail = (item: CalculationDetailListItem): CalculationDetail => ({
  initiativeId: resolveInitiativeId(item),
  componentType: item.ComponentType as CalculationDetail['componentType'],
  kpiCode: item.KPICode ? asKpiCode(item.KPICode) : undefined,
  conversionCode: item.ConversionCode ? asConversionCode(item.ConversionCode) : undefined,
  year: Number(item.Year),
  month: Number(item.Month),
  baseValue: item.BaseValue !== undefined ? Number(item.BaseValue) : undefined,
  conversionValue: item.ConversionValue !== undefined ? Number(item.ConversionValue) : undefined,
  resultValue: item.ResultValue !== undefined ? Number(item.ResultValue) : undefined,
})

export const toSharePointCalculationResultPayload = (
  result: CalculationResult,
): Omit<CreateCalculationResultPayload, 'InitiativeId'> => ({
  Year: result.year,
  Month: result.month,
  GainValue: result.gainValue,
  AccumulatedValue: result.accumulatedValue,
  AnnualValue: result.annualValue,
})

export const toSharePointCalculationDetailPayload = (
  detail: CalculationDetail,
): Omit<CreateCalculationDetailPayload, 'InitiativeId'> => ({
  ComponentType: detail.componentType,
  KPICode: detail.kpiCode,
  ConversionCode: detail.conversionCode,
  Year: detail.year,
  Month: detail.month,
  BaseValue: detail.baseValue,
  ConversionValue: detail.conversionValue,
  ResultValue: detail.resultValue,
})

export const toCalculationSnapshot = (
  initiativeId: InitiativeId,
  results: readonly CalculationResult[],
  details: readonly CalculationDetail[],
): InitiativeCalculationSnapshot => ({
  initiativeId,
  year: results[0]?.year ?? details[0]?.year ?? new Date().getUTCFullYear(),
  results,
  details,
  calculatedAt: new Date().toISOString(),
  issues: [],
})
