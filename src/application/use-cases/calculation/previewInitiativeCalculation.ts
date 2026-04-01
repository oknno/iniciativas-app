import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'
import { CalculationEngine } from '../../../domain/calculation/engine/CalculationEngine'
import { toConversionValues, type PreviewCalculationInput } from '../../mappers/calculation/calculationMappers'

export async function previewInitiativeCalculation(input: PreviewCalculationInput): Promise<InitiativeCalculationSnapshot> {
  return CalculationEngine.run({
    initiativeId: input.initiativeId,
    year: input.year,
    scenario: input.scenario,
    components: input.components,
    formulaTerms: [],
    kpiValues: input.kpiValues,
    fixedValues: input.componentValues,
    conversionValues: toConversionValues(input.conversionValues),
  })
}
