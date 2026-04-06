import type { ComponentType } from '../../catalogs/value-objects/ComponentType'
import type { ConversionCode } from '../../catalogs/value-objects/ConversionCode'
import type { KpiCode } from '../../catalogs/value-objects/KpiCode'
import type { InitiativeId } from '../../initiatives/value-objects/InitiativeId'

export interface CalculationDetail {
  readonly initiativeId: InitiativeId
  readonly componentType: ComponentType
  readonly kpiCode?: KpiCode
  readonly conversionCode?: ConversionCode
  readonly year: number
  readonly month: number
  readonly baseValue?: number
  readonly conversionValue?: number
  readonly resultValue?: number
}
