import type { SaveComponentValueDto } from '../../dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../dto/initiatives/SaveKpiValueDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'

export async function getInitiativeValues(
  initiativeId: InitiativeId,
  year: number,
  scenario: Scenario,
): Promise<{ readonly kpiValues: readonly SaveKpiValueDto[]; readonly componentValues: readonly SaveComponentValueDto[] }> {
  return initiativeValuesRepository.listByInitiativeYearScenario(initiativeId, year, scenario)
}
