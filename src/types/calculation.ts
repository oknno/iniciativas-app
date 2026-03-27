import type { Direction } from './component'

export type CalculationPeriod = string

export type MonthlyMetricValues = Record<CalculationPeriod, Record<number, number | undefined>>

export interface InitiativeCalculationComponentConfig {
  componentId: number
  calculationType: 'KPI_BASED' | 'FIXED'
  formulaType: 'MULTIPLIER' | 'DIRECT_VALUE'
  direction: Direction
  kpiId?: number
  conversionId?: number
}

export interface InitiativeCalculationConfiguration {
  components: InitiativeCalculationComponentConfig[]
}

export interface InitiativeCalculationMonthlyValues {
  kpiValues: MonthlyMetricValues
  componentValues: MonthlyMetricValues
  conversionValues: MonthlyMetricValues
}

export interface InitiativeCalculationInput {
  initiativeId: number
  configuration: InitiativeCalculationConfiguration
  monthlyValues: InitiativeCalculationMonthlyValues
}

export interface InitiativeComponentMonthlyResult {
  componentId: number
  period: CalculationPeriod
  direction: Direction
  rawValue: number
  conversionValue?: number
  finalValue: number
  usedDefaultZero: boolean
}

export interface InitiativeMonthlyGainResult {
  initiativeId: number
  period: CalculationPeriod
  componentResults: InitiativeComponentMonthlyResult[]
  monthlyGain: number
}
