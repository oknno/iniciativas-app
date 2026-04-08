import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'
import type { SaveConversionValueDto } from '../../dto/initiatives/SaveConversionValueDto'
import { conversionValuesRepository } from '../../../services/sharepoint/repositories/conversionValuesRepository'

export async function getConversionValuesByInitiative(
  initiativeId: InitiativeId,
  year: number,
  scenario: Scenario,
): Promise<readonly SaveConversionValueDto[]> {
  return conversionValuesRepository.getByInitiativeYearScenario(initiativeId, year, scenario)
}
