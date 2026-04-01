import type { CalculationType } from '../value-objects/CalculationType'
import type { ConversionCode } from '../value-objects/ConversionCode'
import type { FormulaCode } from '../value-objects/FormulaCode'
import type { KpiCode } from '../value-objects/KpiCode'

export type FormulaTermOperation = 'MULTIPLY' | 'ADD' | 'SUBTRACT'

export interface FormulaTerm {
  readonly formulaCode: FormulaCode
  readonly order: number
  readonly operation: FormulaTermOperation
  readonly signal: 1 | -1
  readonly calculationType: CalculationType
  readonly kpiCode?: KpiCode
  readonly conversionCode?: ConversionCode
}
