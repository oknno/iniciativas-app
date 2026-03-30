import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeStage } from '../../../domain/initiatives/entities/InitiativeStage'
import type { InitiativeStatus } from '../../../domain/initiatives/entities/InitiativeStatus'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'

export interface InitiativeDetailDto {
  readonly id: InitiativeId
  readonly code: string
  readonly title: string
  readonly description?: string
  readonly owner: string
  readonly stage: InitiativeStage
  readonly status: InitiativeStatus
  readonly scenario: Scenario
  readonly annualGain: number
  readonly implementationCost: number
  readonly components: readonly InitiativeComponent[]
}
