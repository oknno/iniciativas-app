import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { SaveInitiativeDto } from '../../dto/initiatives/SaveInitiativeDto'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'

export async function updateInitiative(input: SaveInitiativeDto): Promise<InitiativeDetailDto> {
  const updated = await initiativesRepository.update(input)
  return toInitiativeDetailDto(updated)
}
