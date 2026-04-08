import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { ConversionMasterDto } from '../../dto/catalogs/ConversionMasterDto'
import type { ConversionValueDto } from '../../dto/catalogs/ConversionValueDto'
import type { KpiMasterDto } from '../../dto/catalogs/KpiMasterDto'
import type { SaveComponentValueDto } from '../../dto/initiatives/SaveComponentValueDto'
import type { SaveConversionValueDto } from '../../dto/initiatives/SaveConversionValueDto'
import type { SaveKpiValueDto } from '../../dto/initiatives/SaveKpiValueDto'
import type { InitiativeComponentDraftDto } from './initiativeComponentMappers'
import type { Direction } from '../../../domain/catalogs/value-objects/Direction'
import type { KpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'

export const MONTHS = [
  { month: 1, label: 'Jan' },
  { month: 2, label: 'Feb' },
  { month: 3, label: 'Mar' },
  { month: 4, label: 'Apr' },
  { month: 5, label: 'May' },
  { month: 6, label: 'Jun' },
  { month: 7, label: 'Jul' },
  { month: 8, label: 'Aug' },
  { month: 9, label: 'Sep' },
  { month: 10, label: 'Oct' },
  { month: 11, label: 'Nov' },
  { month: 12, label: 'Dec' },
] as const

export type MonthNumber = (typeof MONTHS)[number]['month']

export type MonthlyInputMap = Partial<Record<MonthNumber, string>>

export interface KpiValueGridRow {
  readonly signature: string
  readonly componentId?: string
  readonly componentName: string
  readonly kpiCode: KpiCode
  readonly kpiName: string
  readonly unit: string
}

export interface FixedValueGridRow {
  readonly signature: string
  readonly componentId?: string
  readonly componentName: string
  readonly direction: Direction
}

export interface ConversionPreviewGroup {
  readonly conversionCode: string
  readonly conversionName: string
  readonly sourceUnit: string
  readonly targetUnit: string
  readonly monthlyValues: Partial<Record<MonthNumber, number>>
}

export interface ConversionValueGridRow {
  readonly signature: string
  readonly conversionCode: string
  readonly conversionName: string
  readonly sourceUnit: string
  readonly targetUnit: string
}

const buildComponentSignature = (component: InitiativeComponentDraftDto): string =>
  `${component.componentCode}|${component.sortOrder}`

const buildKpiRowSignature = (component: InitiativeComponentDraftDto): string =>
  `${buildComponentSignature(component)}|${component.kpiCode ?? ''}`

const buildConversionSignature = (conversionCode: string): string => `CONV|${conversionCode}`

const resolveStableComponentId = (
  component: InitiativeComponentDraftDto,
  componentCatalog: readonly ComponentMasterDto[],
): string => {
  const componentMatch =
    componentCatalog.find((catalogItem) => catalogItem.componentType === component.componentType) ??
    componentCatalog.find((catalogItem) => catalogItem.code === component.componentCode)

  return component.id ?? componentMatch?.componentType ?? component.componentType
}

const toMonthRef = (year: number, month: MonthNumber): MonthRef => `${year}-${String(month).padStart(2, '0')}` as MonthRef

const toMonthNumber = (monthRef: MonthRef, year: number): MonthNumber | undefined => {
  const [monthYear, monthPart] = monthRef.split('-')

  if (Number(monthYear) !== year) {
    return undefined
  }

  const monthNumber = Number(monthPart)
  return MONTHS.some((item) => item.month === monthNumber) ? (monthNumber as MonthNumber) : undefined
}

export const buildKpiValueGridRows = (
  components: readonly InitiativeComponentDraftDto[],
  componentCatalog: readonly ComponentMasterDto[],
  kpiCatalog: readonly KpiMasterDto[],
): readonly KpiValueGridRow[] => {
  const rows = components
    .filter((component) => component.calculationType === 'KPI_BASED' && Boolean(component.kpiCode))
    .map<KpiValueGridRow>((component) => {
      const kpi = kpiCatalog.find((kpiItem) => kpiItem.code === component.kpiCode)
      const componentMatch =
        componentCatalog.find((catalogItem) => catalogItem.componentType === component.componentType) ??
        componentCatalog.find((catalogItem) => catalogItem.code === component.componentCode)

      return {
        signature: buildKpiRowSignature(component),
        componentId: resolveStableComponentId(component, componentCatalog),
        componentName: componentMatch?.name ?? component.componentType,
        kpiCode: component.kpiCode as KpiCode,
        kpiName: kpi?.name ?? component.kpiCode ?? 'Unknown KPI',
        unit: kpi?.unit ?? '-',
      }
    })
  console.log('[InitiativeValueMapper] KPI rows generated:', rows.length)
  return rows
}

export const buildFixedValueGridRows = (
  components: readonly InitiativeComponentDraftDto[],
  componentCatalog: readonly ComponentMasterDto[],
): readonly FixedValueGridRow[] => {
  const rows = components
    .filter((component) => component.calculationType === 'FIXED')
    .map<FixedValueGridRow>((component) => {
      const componentMatch =
        componentCatalog.find((catalogItem) => catalogItem.componentType === component.componentType) ??
        componentCatalog.find((catalogItem) => catalogItem.code === component.componentCode)

      return {
        signature: buildComponentSignature(component),
        componentId: resolveStableComponentId(component, componentCatalog),
        componentName: componentMatch?.name ?? component.componentType,
        direction: component.direction,
      }
    })
  console.log('[InitiativeValueMapper] Fixed rows generated:', rows.length)
  return rows
}

export const buildConversionPreviewGroups = (
  components: readonly InitiativeComponentDraftDto[],
  conversionCatalog: readonly ConversionMasterDto[],
  conversionValues: readonly ConversionValueDto[],
  year: number,
  scenario: Scenario,
  initiativeId?: InitiativeId,
): readonly ConversionPreviewGroup[] => {
  const usedConversionCodes = new Set(
    components
      .filter((component) => component.calculationType === 'KPI_BASED' && Boolean(component.conversionCode))
      .map((component) => component.conversionCode),
  )

  const groups = conversionCatalog
    .filter((conversion) => usedConversionCodes.has(conversion.code))
    .map((conversion) => {
      const monthlyValues: Partial<Record<MonthNumber, number>> = {}

      MONTHS.forEach(({ month }) => {
        const monthRef = toMonthRef(year, month)
        const initiativeSpecific = conversionValues.find((value) =>
          value.conversionCode === conversion.code &&
          value.scenario === scenario &&
          value.monthRef === monthRef &&
          initiativeId !== undefined &&
          value.initiativeId === initiativeId)
        const globalValue = conversionValues.find((value) =>
          value.conversionCode === conversion.code &&
          value.scenario === scenario &&
          value.monthRef === monthRef &&
          value.initiativeId === undefined)
        const resolvedValue = initiativeSpecific ?? globalValue

        if (resolvedValue) {
          monthlyValues[month] = resolvedValue.value
        }
      })

      return {
        conversionCode: conversion.code,
        conversionName: conversion.name,
        sourceUnit: conversion.sourceUnit,
        targetUnit: conversion.targetUnit,
        monthlyValues,
      }
    })
  console.log('[InitiativeValueMapper] Conversion preview groups generated:', groups.length)
  return groups
}

export const buildConversionValueGridRows = (
  components: readonly InitiativeComponentDraftDto[],
  conversionCatalog: readonly ConversionMasterDto[],
): readonly ConversionValueGridRow[] => {
  const usedConversionCodes = new Set(
    components
      .filter((component) => component.calculationType === 'KPI_BASED' && Boolean(component.conversionCode))
      .map((component) => String(component.conversionCode)),
  )

  return conversionCatalog
    .filter((conversion) => usedConversionCodes.has(conversion.code))
    .map((conversion) => ({
      signature: buildConversionSignature(conversion.code),
      conversionCode: conversion.code,
      conversionName: conversion.name,
      sourceUnit: conversion.sourceUnit,
      targetUnit: conversion.targetUnit,
    }))
}

export const toKpiValueDraftMap = (
  values: readonly SaveKpiValueDto[],
  rows: readonly KpiValueGridRow[],
  year: number,
): Readonly<Record<string, MonthlyInputMap>> => {
  const byComponentId = new Map(rows.filter((row) => row.componentId).map((row) => [row.componentId as string, row.signature]))
  const byKpiCode = new Map(rows.map((row) => [row.kpiCode, row.signature]))
  const next: Record<string, MonthlyInputMap> = {}

  values.forEach((value) => {
    const signature = byComponentId.get(value.componentId) ?? byKpiCode.get(value.kpiCode)
    const month = toMonthNumber(value.monthRef, year)

    if (!signature || !month) {
      return
    }

    next[signature] = {
      ...(next[signature] ?? {}),
      [month]: String(value.value),
    }
  })

  return next
}

export const toFixedValueDraftMap = (
  values: readonly SaveComponentValueDto[],
  rows: readonly FixedValueGridRow[],
  year: number,
): Readonly<Record<string, MonthlyInputMap>> => {
  const byComponentId = new Map(rows.filter((row) => row.componentId).map((row) => [row.componentId as string, row.signature]))
  const byCanonicalType = new Map(
    rows
      .filter((row) => row.componentId)
      .map((row) => [String(row.componentId), row.signature]),
  )
  const next: Record<string, MonthlyInputMap> = {}

  values.forEach((value) => {
    const signature = byComponentId.get(value.componentId) ?? byCanonicalType.get(value.componentId)
    const month = toMonthNumber(value.monthRef, year)

    if (!signature || !month) {
      return
    }

    next[signature] = {
      ...(next[signature] ?? {}),
      [month]: String(value.baseValue),
    }
  })

  return next
}

export const toSaveKpiValueDtos = (
  initiativeId: InitiativeId,
  year: number,
  scenario: Scenario,
  rows: readonly KpiValueGridRow[],
  valuesByRow: Readonly<Record<string, MonthlyInputMap>>,
): readonly SaveKpiValueDto[] => {
  const result: SaveKpiValueDto[] = []

  rows.forEach((row) => {
    if (!row.componentId) {
      return
    }

    const componentId = row.componentId
    const monthlyValues = valuesByRow[row.signature] ?? {}

    MONTHS.forEach(({ month }) => {
      const rawValue = monthlyValues[month]
      if (rawValue === undefined || rawValue.trim() === '') {
        return
      }

      const parsed = Number(rawValue)
      if (!Number.isFinite(parsed)) {
        return
      }

      result.push({
        initiativeId,
        componentId,
        kpiCode: row.kpiCode,
        monthRef: toMonthRef(year, month),
        scenario,
        value: parsed,
      })
    })
  })

  return result
}

export const toSaveComponentValueDtos = (
  initiativeId: InitiativeId,
  year: number,
  scenario: Scenario,
  rows: readonly FixedValueGridRow[],
  valuesByRow: Readonly<Record<string, MonthlyInputMap>>,
): readonly SaveComponentValueDto[] => {
  const result: SaveComponentValueDto[] = []

  rows.forEach((row) => {
    if (!row.componentId) {
      return
    }

    const componentId = row.componentId
    const monthlyValues = valuesByRow[row.signature] ?? {}

    MONTHS.forEach(({ month }) => {
      const rawValue = monthlyValues[month]
      if (rawValue === undefined || rawValue.trim() === '') {
        return
      }

      const parsed = Number(rawValue)
      if (!Number.isFinite(parsed)) {
        return
      }

      result.push({
        initiativeId,
        componentId,
        monthRef: toMonthRef(year, month),
        scenario,
        baseValue: parsed,
        direction: row.direction,
      })
    })
  })

  return result
}

export const toConversionValueDraftMap = (
  values: readonly ConversionValueDto[],
  rows: readonly ConversionValueGridRow[],
  year: number,
): Readonly<Record<string, MonthlyInputMap>> => {
  const byConversionCode = new Map(rows.map((row) => [row.conversionCode, row.signature]))
  const next: Record<string, MonthlyInputMap> = {}

  values.forEach((value) => {
    const signature = byConversionCode.get(value.conversionCode)
    const month = toMonthNumber(value.monthRef, year)

    if (!signature || !month) {
      return
    }

    next[signature] = {
      ...(next[signature] ?? {}),
      [month]: String(value.value),
    }
  })

  return next
}

export const toSaveConversionValueDtos = (
  initiativeId: InitiativeId,
  year: number,
  scenario: Scenario,
  rows: readonly ConversionValueGridRow[],
  valuesByRow: Readonly<Record<string, MonthlyInputMap>>,
): readonly SaveConversionValueDto[] => {
  const result: SaveConversionValueDto[] = []

  rows.forEach((row) => {
    const monthlyValues = valuesByRow[row.signature] ?? {}

    MONTHS.forEach(({ month }) => {
      const rawValue = monthlyValues[month]
      if (rawValue === undefined || rawValue.trim() === '') {
        return
      }

      const parsed = Number(rawValue)
      if (!Number.isFinite(parsed)) {
        return
      }

      result.push({
        initiativeId,
        conversionCode: row.conversionCode as SaveConversionValueDto['conversionCode'],
        monthRef: toMonthRef(year, month),
        scenario,
        value: parsed,
      })
    })
  })

  return result
}
