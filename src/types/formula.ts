export type FormulaType =
  | 'MULTIPLIER'
  | 'DELTA'
  | 'DIRECT'
  | 'AGGREGATION'
  | 'INCREMENTAL'

export type FormulaCode =
  | 'MULTIPLIER'
  | 'DELTA'
  | 'DIRECT_VALUE'
  | 'COMPONENT_SUM'
  | 'INCREMENTAL_REVENUE'

export interface FormulaMaster {
  id: number
  title: string
  code: FormulaCode
  type: FormulaType
  isActive: boolean
}
