import type { Direction } from '../../catalogs/value-objects/Direction'

export interface CalculationDetail {
  readonly componentId: string
  readonly componentName: string
  readonly direction: Direction
  readonly baseValue: number
  readonly signedValue: number
  readonly explanation: string
}
