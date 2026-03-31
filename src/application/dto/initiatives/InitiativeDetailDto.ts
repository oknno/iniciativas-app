import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

export interface InitiativeDetailDto {
  readonly id: InitiativeId
  readonly title: string
  readonly unidade: string
  readonly responsavel: string
  readonly stage: string
  readonly status: string
  readonly annualGain: number
  readonly components: readonly InitiativeComponent[]
}
