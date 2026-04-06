import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

export interface SaveInitiativeDto {
  readonly id?: InitiativeId
  readonly title: string
  readonly unidade: string
  readonly responsavel: string
  readonly stage: string
  readonly status: string
  readonly decisionComment?: string
}
