import type { ComponentType } from '../../catalogs/value-objects/ComponentType'
import type { ConversionCode } from '../../catalogs/value-objects/ConversionCode'
import type { Direction } from '../../catalogs/value-objects/Direction'
import type { FormulaCode } from '../../catalogs/value-objects/FormulaCode'
import type { KpiCode } from '../../catalogs/value-objects/KpiCode'
import type { InitiativeId } from '../../initiatives/value-objects/InitiativeId'

export interface CalculationDetail {
  readonly initiativeId: InitiativeId
  readonly componentType: ComponentType
  readonly year: number
  readonly month: number
  readonly formulaCode: FormulaCode
  readonly direction: Direction
  readonly rawValue: number
  readonly signedValue: number
  readonly baseValue?: number
  readonly conversionValue?: number
  readonly resultValue?: number
  readonly kpiCode?: KpiCode
  readonly conversionCode?: ConversionCode
  readonly sourceType: 'KPI_BASED' | 'FIXED'
  readonly explanation: string
}
