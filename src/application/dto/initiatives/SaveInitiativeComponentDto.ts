import type { CalculationType } from '../../../domain/catalogs/value-objects/CalculationType'
import type { ComponentType } from '../../../domain/catalogs/value-objects/ComponentType'
import type { ConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import type { Direction } from '../../../domain/catalogs/value-objects/Direction'
import type { FormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import type { KpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

export interface SaveInitiativeComponentDto {
  readonly id?: string
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
