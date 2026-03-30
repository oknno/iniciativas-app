export type FormulaCode = string & { readonly __brand: 'FormulaCode' }

export const asFormulaCode = (value: string): FormulaCode => value as FormulaCode
