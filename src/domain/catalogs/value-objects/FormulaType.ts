export const FORMULA_TYPES = ['NONE', 'LINEAR', 'PERCENTAGE'] as const

export type FormulaType = (typeof FORMULA_TYPES)[number]
