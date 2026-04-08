import type { InitiativeListItemDto } from '../../dto/initiatives/InitiativeListItemDto'
import { toInitiativeListItemDto } from '../../mappers/initiatives/initiativeMappers'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'

export interface GetInitiativesInput {
  readonly pageSize?: number
  readonly pageToken?: string
}

export interface GetInitiativesOutput {
  readonly items: readonly InitiativeListItemDto[]
  readonly nextPageToken?: string
  readonly totalCount: number
}

export async function getInitiatives(input?: GetInitiativesInput): Promise<GetInitiativesOutput> {
  const page = await initiativesRepository.list({
    top: input?.pageSize,
    pageToken: input?.pageToken,
  })

  return {
    items: page.items.map(toInitiativeListItemDto),
    nextPageToken: page.nextPageToken,
    totalCount: page.totalCount,
  }
}
