import type { InitiativeComponent } from './InitiativeComponent'
import type { InitiativeId } from '../value-objects/InitiativeId'

export interface Initiative {
  readonly id: InitiativeId
  readonly title: string
  readonly unidade: string
  readonly responsavel: string
  readonly stage: string
  readonly status: string
  readonly components: readonly InitiativeComponent[]
  readonly createdAt: string
  readonly updatedAt: string
}
