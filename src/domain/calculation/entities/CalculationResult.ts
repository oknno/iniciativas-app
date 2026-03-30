import type { MonthRef } from '../../initiatives/value-objects/MonthRef'
import type { Scenario } from '../../initiatives/value-objects/Scenario'
import type { InitiativeId } from '../../initiatives/value-objects/InitiativeId'
import type { CalculationDetail } from './CalculationDetail'

export interface CalculationResult {
  readonly initiativeId: InitiativeId
  readonly monthRef: MonthRef
  readonly scenario: Scenario
  readonly finalGain: number
  readonly detail: readonly CalculationDetail[]
  readonly calculatedAt: string
}
