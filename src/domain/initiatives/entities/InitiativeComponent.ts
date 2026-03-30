import type { CalculationType } from '../../catalogs/value-objects/CalculationType'
import type { ComponentType } from '../../catalogs/value-objects/ComponentType'
import type { ConversionCode } from '../../catalogs/value-objects/ConversionCode'
import type { Direction } from '../../catalogs/value-objects/Direction'
import type { FormulaCode } from '../../catalogs/value-objects/FormulaCode'
import type { KpiCode } from '../../catalogs/value-objects/KpiCode'
import type { InitiativeId } from '../value-objects/InitiativeId'

export interface InitiativeComponent {
  readonly id: string
  readonly initiativeId: InitiativeId
  readonly name: string
  readonly componentType: ComponentType
  readonly direction: Direction
  readonly calculationType: CalculationType
  readonly kpiCode?: KpiCode
  readonly conversionCode?: ConversionCode
  readonly formulaCode?: FormulaCode
  readonly fixedValue?: number
  readonly sortOrder: number
}
