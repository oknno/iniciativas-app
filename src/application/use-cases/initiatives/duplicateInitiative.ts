import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { toInitiativeDetailDto } from '../../mappers/initiatives/initiativeMappers'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'

export async function duplicateInitiative(id: InitiativeId): Promise<InitiativeDetailDto> {
  const duplicate = await initiativesRepository.duplicate(id)
  return toInitiativeDetailDto(duplicate)
}
