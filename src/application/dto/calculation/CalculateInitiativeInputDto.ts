import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'

export interface CalculateInitiativeInputDto {
  readonly initiativeId: InitiativeId
  readonly monthRef: MonthRef
  readonly scenario: Scenario
}
