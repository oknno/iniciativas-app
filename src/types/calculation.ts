import type { CalculationType, ComponentTypeCode, Direction } from './component'
import type { ConversionCode } from './conversion'
import type { FormulaCode } from './formula'
import type { KPICode } from './kpi'

export interface InitiativeValueBase {
  initiativeId: number
  year: number
  month: number
  value: number
}

export interface KpiValueInput extends InitiativeValueBase {
  kpiCode: KPICode
}

export interface ComponentValueInput extends InitiativeValueBase {
  componentType: ComponentTypeCode
}

export interface ConversionValue {
  conversionCode: ConversionCode
  year: number
  month: number
  value: number
  scenario?: string
}

export interface InitiativeComponentConfig {
  componentType: ComponentTypeCode
  calculationType: CalculationType
  direction: Direction
  formulaCode: FormulaCode
  kpiCode?: KPICode
  conversionCode?: ConversionCode
}

export interface ComponentMonthlyCalculationResult {
  componentType: ComponentTypeCode
  year: number
  month: number
  componentValue: number
  signedValue: number
}

export interface MonthlyGainResult {
  initiativeId: number
  year: number
  month: number
  gainValue: number
  components: ComponentMonthlyCalculationResult[]
}
