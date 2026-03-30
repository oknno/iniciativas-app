import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { SaveInitiativeDto } from '../../dto/initiatives/SaveInitiativeDto'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'

export async function createInitiative(input: SaveInitiativeDto): Promise<InitiativeDetailDto> {
  const created = await initiativesRepository.create(input)
  return toInitiativeDetailDto(created)
}
