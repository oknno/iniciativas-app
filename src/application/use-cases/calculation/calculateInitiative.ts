import type { CalculateInitiativeInputDto } from '../../dto/calculation/CalculateInitiativeInputDto'
import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'
import { CalculationEngine } from '../../../domain/calculation/engine/CalculationEngine'
import { toConversionValues } from '../../mappers/calculation/calculationMappers'
import { initiativeComponentsRepository } from '../../../services/sharepoint/repositories/initiativeComponentsRepository'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'
import { calculationRepository } from '../../../services/sharepoint/repositories/calculationRepository'
import { catalogsRepository } from '../../../services/sharepoint/repositories/catalogsRepository'

const getYear = (monthRef: string): number => Number(monthRef.split('-')[0])

export async function calculateInitiative(input: CalculateInitiativeInputDto): Promise<InitiativeCalculationSnapshot> {
  const year = getYear(input.monthRef)
  const [components, values, conversionValues] = await Promise.all([
    initiativeComponentsRepository.listByInitiativeId(input.initiativeId),
    initiativeValuesRepository.listByInitiativeYearScenario(input.initiativeId, year, input.scenario),
    catalogsRepository.listConversionValues(),
  ])

  const snapshot = CalculationEngine.run({
    initiativeId: input.initiativeId,
    year,
    scenario: input.scenario,
    components,
    kpiValues: values.kpiValues,
    fixedValues: values.componentValues,
    conversionValues: toConversionValues(conversionValues),
  })

  await calculationRepository.save(snapshot)
  return snapshot
}
