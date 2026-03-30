import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'

export async function getInitiativeById(id: InitiativeId): Promise<InitiativeDetailDto | undefined> {
  const initiative = await initiativesRepository.getById(id)
  return initiative ? toInitiativeDetailDto(initiative) : undefined
}
