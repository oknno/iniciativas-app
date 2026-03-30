import type { InitiativeListItemDto } from '../../dto/initiatives/InitiativeListItemDto'
import { toInitiativeListItemDto } from '../../mappers/initiatives/initiativeMappers'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'

export async function getInitiatives(): Promise<readonly InitiativeListItemDto[]> {
  const initiatives = await initiativesRepository.list()
  return initiatives.map(toInitiativeListItemDto)
}
