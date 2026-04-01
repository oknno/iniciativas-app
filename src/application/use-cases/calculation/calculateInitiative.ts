import type { CalculateInitiativeInputDto } from '../../dto/calculation/CalculateInitiativeInputDto'
import type { FormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
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
  const formulaCodes = [
    ...new Set(
      components
        .map((component) => component.formulaCode)
        .filter((formulaCode): formulaCode is FormulaCode => formulaCode !== undefined),
    ),
  ]
  const formulaTerms = (await Promise.all(formulaCodes.map((formulaCode) => catalogsRepository.listFormulaTerms(formulaCode)))).flat()

  const snapshot = CalculationEngine.run({
    initiativeId: input.initiativeId,
    year,
    scenario: input.scenario,
    components,
    formulaTerms,
    kpiValues: values.kpiValues,
    fixedValues: values.componentValues,
    conversionValues: toConversionValues(conversionValues),
  })

  await calculationRepository.save(snapshot)
  return snapshot
}
