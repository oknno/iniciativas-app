import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeStage } from '../../../domain/initiatives/entities/InitiativeStage'
import type { InitiativeStatus } from '../../../domain/initiatives/entities/InitiativeStatus'

export interface InitiativeListItemDto {
  readonly id: InitiativeId
  readonly code: string
  readonly title: string
  readonly owner: string
  readonly stage: InitiativeStage
  readonly status: InitiativeStatus
  readonly annualGain: number
}
