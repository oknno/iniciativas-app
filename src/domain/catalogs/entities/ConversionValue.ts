import type { ConversionCode } from '../value-objects/ConversionCode'
import type { MonthRef } from '../../initiatives/value-objects/MonthRef'
import type { Scenario } from '../../initiatives/value-objects/Scenario'

export interface ConversionValue {
  readonly conversionCode: ConversionCode
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly value: number
}
