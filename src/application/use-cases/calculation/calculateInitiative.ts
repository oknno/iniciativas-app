import type { CalculateInitiativeInputDto } from '../../dto/calculation/CalculateInitiativeInputDto'
import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'
import { CalculationEngine } from '../../../domain/calculation/engine/CalculationEngine'
import { mockConversionValues } from '../../../app/pages/InitiativesPage/mocks/mockCatalogs'
import { toConversionValues } from '../../mappers/calculation/calculationMappers'
import { initiativeComponentsRepository } from '../../../services/sharepoint/repositories/initiativeComponentsRepository'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'
import { calculationRepository } from '../../../services/sharepoint/repositories/calculationRepository'

const getYear = (monthRef: string): number => Number(monthRef.split('-')[0])

export async function calculateInitiative(input: CalculateInitiativeInputDto): Promise<InitiativeCalculationSnapshot> {
  const year = getYear(input.monthRef)
  const [components, values] = await Promise.all([
    initiativeComponentsRepository.listByInitiativeId(input.initiativeId),
    initiativeValuesRepository.listByInitiativeYearScenario(input.initiativeId, year, input.scenario),
  ])

  const snapshot = CalculationEngine.run({
    initiativeId: input.initiativeId,
    year,
    scenario: input.scenario,
    components,
    kpiValues: values.kpiValues,
    fixedValues: values.componentValues,
    conversionValues: toConversionValues(mockConversionValues),
  })

  await calculationRepository.save(snapshot)
  return snapshot
}
