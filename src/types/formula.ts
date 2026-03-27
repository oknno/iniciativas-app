export type FormulaCode = string

export type FormulaType = 'SUM' | 'MULTIPLY' | 'DIVIDE' | 'CUSTOM'

export interface FormulaMaster {
  id: number
  title: string
  code: FormulaCode
  type: FormulaType
  expression: string
  notes?: string
  isActive?: boolean
  created?: string
  modified?: string
}
