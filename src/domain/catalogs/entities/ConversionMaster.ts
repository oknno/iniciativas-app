import type { ConversionCode } from '../value-objects/ConversionCode'

export interface ConversionMaster {
  readonly code: ConversionCode
  readonly name: string
  readonly sourceUnit: string
  readonly targetUnit: string
  readonly description?: string
  readonly active: boolean
}
