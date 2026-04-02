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
  console.log('[GetInitiativeValues] Selected initiative id:', initiativeId, 'year:', year, 'scenario:', scenario)
  const values = await initiativeValuesRepository.listByInitiativeYearScenario(initiativeId, year, scenario)
  console.log('[GetInitiativeValues] Loaded KPI values count:', values.kpiValues.length)
  console.log('[GetInitiativeValues] Loaded fixed values count:', values.componentValues.length)
  return values
}
