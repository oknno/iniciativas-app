import type { CalculationResult } from '../../../domain/calculation/entities/CalculationResult'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { calculationRepository } from '../../../services/sharepoint/repositories/calculationRepository'

export async function getCalculationResult(initiativeId: InitiativeId): Promise<readonly CalculationResult[]> {
  const snapshot = await calculationRepository.getByInitiativeId(initiativeId)
  return snapshot?.results ?? []
}
