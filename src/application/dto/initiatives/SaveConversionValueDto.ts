import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { ConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'

export interface SaveConversionValueDto {
  readonly initiativeId: InitiativeId
  readonly conversionCode: ConversionCode
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly value: number
}
