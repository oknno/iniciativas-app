import type { ConversionCode } from '../value-objects/ConversionCode'
import type { MonthRef } from '../../initiatives/value-objects/MonthRef'
import type { Scenario } from '../../initiatives/value-objects/Scenario'
import type { InitiativeId } from '../../initiatives/value-objects/InitiativeId'

export interface ConversionValue {
  readonly conversionCode: ConversionCode
  readonly initiativeId?: InitiativeId
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly value: number
}
