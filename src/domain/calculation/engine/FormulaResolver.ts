import type { FormulaCode } from '../../catalogs/value-objects/FormulaCode'
import { resolveSupportedFormula, type SupportedFormula } from '../rules/formulaRules'

export interface FormulaCalculationInput {
  readonly formulaCode: FormulaCode
  readonly kpiValue?: number
  readonly conversionValue?: number
  readonly fixedValue?: number
}

export const FormulaResolver = {
  resolveFormula(formulaCode: FormulaCode): SupportedFormula | undefined {
    return resolveSupportedFormula(formulaCode)
  },

  calculate(input: FormulaCalculationInput): number {
    const formula = resolveSupportedFormula(input.formulaCode)

    if (formula === 'MULTIPLIER') {
      return (input.kpiValue ?? 0) * (input.conversionValue ?? 0)
    }

    if (formula === 'DIRECT_VALUE') {
      return input.fixedValue ?? 0
    }

    return 0
  },
}
