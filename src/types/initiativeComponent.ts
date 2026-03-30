import type { ComponentTypeCode } from './component'
import type { ConversionCode } from './conversion'
import type { FormulaCode } from './formula'
import type { KPICode } from './kpi'

export interface InitiativeComponent {
  initiativeId: number
  componentType: ComponentTypeCode
  kpiCode?: KPICode
  conversionCode?: ConversionCode
  formulaCode: FormulaCode
}
