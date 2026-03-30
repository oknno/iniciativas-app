import type { CalculationDetail } from '../../../domain/calculation/entities/CalculationDetail'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { calculationRepository } from '../../../services/sharepoint/repositories/calculationRepository'

export async function getCalculationDetails(initiativeId: InitiativeId): Promise<readonly CalculationDetail[]> {
  const snapshot = await calculationRepository.getByInitiativeId(initiativeId)
  return snapshot?.details ?? []
}
