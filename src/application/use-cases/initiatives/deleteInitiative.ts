import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { initiativesRepository } from '../../../services/sharepoint/repositories/initiativesRepository'

export async function deleteInitiative(id: InitiativeId): Promise<void> {
  await initiativesRepository.delete(id)
}
