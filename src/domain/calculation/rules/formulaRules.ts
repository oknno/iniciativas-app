import type { CalculationType } from '../../catalogs/value-objects/CalculationType'
import type { FormulaCode } from '../../catalogs/value-objects/FormulaCode'

export type SupportedFormula = 'MULTIPLIER' | 'DIRECT_VALUE'

export const FORMULA_CODE_MAP: Record<FormulaCode, SupportedFormula | undefined> = {
  'FORMULA-MULTIPLIER': 'MULTIPLIER',
  'FORMULA-DIRECT-VALUE': 'DIRECT_VALUE',
} as Record<FormulaCode, SupportedFormula | undefined>

export const resolveSupportedFormula = (formulaCode: FormulaCode): SupportedFormula | undefined => FORMULA_CODE_MAP[formulaCode]

export const isFormulaSupportedForCalculationType = (
  calculationType: CalculationType,
  formula: SupportedFormula,
): boolean => {
  if (calculationType === 'KPI_BASED') {
    return formula === 'MULTIPLIER'
  }

  return formula === 'DIRECT_VALUE'
}
