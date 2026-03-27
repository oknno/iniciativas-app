import type { ConversionCode } from './conversion'
import type { FormulaCode } from './formula'
import type { KPICode } from './kpi'

export type InitiativeComponentType = 'KPI_BASED' | 'FIXED'

export interface InitiativeComponent {
  initiativeId: number
  componentType: InitiativeComponentType
  kpiCode?: KPICode
  conversionCode?: ConversionCode
  formulaCode: FormulaCode
}
