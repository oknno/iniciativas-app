import type { InitiativeDetailDto } from '../application/dto/initiatives/InitiativeDetailDto'
import type { InitiativeListItemDto } from '../application/dto/initiatives/InitiativeListItemDto'

export interface InitiativeListViewModel {
  readonly items: readonly InitiativeListItemDto[]
  readonly selectedId?: string
}

export interface InitiativeSummaryViewModel {
  readonly selected?: InitiativeDetailDto
}
