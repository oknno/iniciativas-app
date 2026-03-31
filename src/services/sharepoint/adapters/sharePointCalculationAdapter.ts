import type { CalculationDetail } from '../../../domain/calculation/entities/CalculationDetail'
import type { CalculationResult } from '../../../domain/calculation/entities/CalculationResult'
import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'
import type { CalculationDetailListItem, CreateCalculationDetailPayload } from '../lists/calculationDetailsListApi'
import type { CalculationResultListItem, CreateCalculationResultPayload } from '../lists/calculationResultsListApi'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import { asInitiativeId, type InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

export const initiativeIdFromSharePointCalculation = (id: number | string): InitiativeId => asInitiativeId(String(id))

export const initiativeIdToSharePointCalculation = (initiativeId: InitiativeId): number => {
  const parsed = Number(initiativeId)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid SharePoint initiative id '${initiativeId}'.`)
  }

  return parsed
}

export const fromSharePointCalculationResult = (item: CalculationResultListItem): CalculationResult => ({
  initiativeId: initiativeIdFromSharePointCalculation(item.InitiativeId),
  year: Number(item.Year),
  month: Number(item.Month),
  gainValue: Number(item.GainValue),
})

export const fromSharePointCalculationDetail = (item: CalculationDetailListItem): CalculationDetail => ({
  initiativeId: initiativeIdFromSharePointCalculation(item.InitiativeId),
  componentType: item.ComponentType as CalculationDetail['componentType'],
  year: Number(item.Year),
  month: Number(item.Month),
  formulaCode: asFormulaCode(item.FormulaCode),
  direction: item.Direction as CalculationDetail['direction'],
  rawValue: Number(item.RawValue),
  signedValue: Number(item.SignedValue),
  kpiCode: item.KpiCode ? asKpiCode(item.KpiCode) : undefined,
  conversionCode: item.ConversionCode ? asConversionCode(item.ConversionCode) : undefined,
  sourceType: item.SourceType as CalculationDetail['sourceType'],
  explanation: item.Explanation,
})

export const toSharePointCalculationResultPayload = (
  result: CalculationResult,
): Omit<CreateCalculationResultPayload, 'InitiativeId'> => ({
  Year: result.year,
  Month: result.month,
  GainValue: result.gainValue,
})

export const toSharePointCalculationDetailPayload = (
  detail: CalculationDetail,
): Omit<CreateCalculationDetailPayload, 'InitiativeId'> => ({
  ComponentType: detail.componentType,
  Year: detail.year,
  Month: detail.month,
  FormulaCode: detail.formulaCode,
  Direction: detail.direction,
  RawValue: detail.rawValue,
  SignedValue: detail.signedValue,
  KpiCode: detail.kpiCode,
  ConversionCode: detail.conversionCode,
  SourceType: detail.sourceType,
  Explanation: detail.explanation,
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
