import type { FormulaCode } from '../value-objects/FormulaCode'
import type { FormulaType } from '../value-objects/FormulaType'

export interface FormulaMaster {
  readonly code: FormulaCode
  readonly name: string
  readonly formulaType: FormulaType
  readonly expression: string
  readonly description?: string
  readonly active: boolean
}
