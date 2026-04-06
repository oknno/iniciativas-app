import type { ConversionValue } from '../../catalogs/entities/ConversionValue'
import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'

export const MONTH_POLICIES = ['FIXED_12_MONTHS', 'WINDOW_WITH_DATA'] as const

export type MonthPolicy = (typeof MONTH_POLICIES)[number]

export const DEFAULT_MONTH_POLICY: MonthPolicy = 'FIXED_12_MONTHS'

const toMonthRef = (year: number, month: number): string => `${year}-${String(month).padStart(2, '0')}`

const monthRefToMonthNumber = (monthRef: string, year: number): number | undefined => {
  const [yearPart, monthPart] = monthRef.split('-')
  const parsedYear = Number(yearPart)
  const parsedMonth = Number(monthPart)

  if (!Number.isInteger(parsedYear) || !Number.isInteger(parsedMonth) || parsedYear !== year || parsedMonth < 1 || parsedMonth > 12) {
    return undefined
  }

  return parsedMonth
}

export const resolveCalculationMonths = (input: {
  year: number
  policy?: MonthPolicy
  kpiValues: readonly SaveKpiValueDto[]
  fixedValues: readonly SaveComponentValueDto[]
  conversionValues: readonly ConversionValue[]
}): readonly number[] => {
  if ((input.policy ?? DEFAULT_MONTH_POLICY) === 'FIXED_12_MONTHS') {
    return Array.from({ length: 12 }, (_, index) => index + 1)
  }

  const monthsWithData = new Set<number>()
  ;[...input.kpiValues, ...input.fixedValues, ...input.conversionValues].forEach((item) => {
    const month = monthRefToMonthNumber(item.monthRef, input.year)
    if (month) {
      monthsWithData.add(month)
    }
  })

  if (monthsWithData.size === 0) {
    return Array.from({ length: 12 }, (_, index) => index + 1)
  }

  const sortedMonths = Array.from(monthsWithData.values()).sort((left, right) => left - right)
  const first = sortedMonths[0]
  const last = sortedMonths[sortedMonths.length - 1]

  return Array.from({ length: last - first + 1 }, (_, index) => first + index).filter((month) =>
    toMonthRef(input.year, month).startsWith(`${input.year}-`),
  )
}
