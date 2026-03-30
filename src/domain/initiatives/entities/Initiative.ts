import type { InitiativeComponent } from './InitiativeComponent'
import type { InitiativeStage } from './InitiativeStage'
import type { InitiativeStatus } from './InitiativeStatus'
import type { InitiativeId } from '../value-objects/InitiativeId'
import type { MonthRef } from '../value-objects/MonthRef'
import type { Scenario } from '../value-objects/Scenario'

export interface Initiative {
  readonly id: InitiativeId
  readonly code: string
  readonly title: string
  readonly description?: string
  readonly owner: string
  readonly stage: InitiativeStage
  readonly status: InitiativeStatus
  readonly scenario: Scenario
  readonly implementationCost: number
  readonly startMonthRef: MonthRef
  readonly endMonthRef: MonthRef
  readonly components: readonly InitiativeComponent[]
  readonly createdAt: string
  readonly updatedAt: string
}
