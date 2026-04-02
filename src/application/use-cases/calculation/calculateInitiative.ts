import type { CalculateInitiativeInputDto } from '../../dto/calculation/CalculateInitiativeInputDto'
import type { FormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'
import { CalculationEngine } from '../../../domain/calculation/engine/CalculationEngine'
import { BusinessRuleError } from '../../../domain/shared/errors/BusinessRuleError'
import { toConversionValues } from '../../mappers/calculation/calculationMappers'
import { initiativeComponentsRepository } from '../../../services/sharepoint/repositories/initiativeComponentsRepository'
import { initiativeValuesRepository } from '../../../services/sharepoint/repositories/initiativeValuesRepository'
import { calculationRepository } from '../../../services/sharepoint/repositories/calculationRepository'
import { catalogsRepository } from '../../../services/sharepoint/repositories/catalogsRepository'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'
import { ensureFormulaExists, ensureFormulaTermsOrFallback } from '../../services/businessRuleGuards'

const getYear = (monthRef: string): number => Number(monthRef.split('-')[0])

export async function calculateInitiative(input: CalculateInitiativeInputDto): Promise<InitiativeCalculationSnapshot> {
  const year = getYear(input.monthRef)
  const [components, values, conversionValues, formulaCatalog] = await Promise.all([
    initiativeComponentsRepository.listByInitiativeId(input.initiativeId),
    initiativeValuesRepository.listByInitiativeYearScenario(input.initiativeId, year, input.scenario),
    catalogsRepository.listConversionValues(),
    catalogsRepository.listFormulaCatalog(),
  ])

  const formulaCodes = [
    ...new Set(
      components
        .map((component) => component.formulaCode)
        .filter((formulaCode): formulaCode is FormulaCode => formulaCode !== undefined),
    ),
  ]

  if (components.some((component) => !component.formulaCode)) {
    throw new BusinessRuleError('Fórmula inválida')
  }

  formulaCodes.forEach((formulaCode) => ensureFormulaExists(formulaCode, formulaCatalog))
  formulaCodes.forEach((formulaCode) => {
    const exists = formulaCatalog.some((formula) => formula.code === formulaCode)
    console.info('[Calculation] fórmula encontrada?', { formulaCode, found: exists })
  })

  const formulaTerms = (await Promise.all(formulaCodes.map((formulaCode) => catalogsRepository.listFormulaTerms(formulaCode)))).flat()
  components.forEach((component) => {
    const termsByFormulaAndType = formulaTerms.filter((term) =>
      term.formulaCode === component.formulaCode &&
      (!term.componentType || term.componentType === component.componentType))
    console.info('[Calculation] termos encontrados?', {
      componentType: component.componentType,
      formulaCode: component.formulaCode,
      foundCount: termsByFormulaAndType.length,
      found: termsByFormulaAndType.length > 0,
    })
  })
  ensureFormulaTermsOrFallback(formulaTerms)

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

  const hasMissingConversion = snapshot.issues.some((issue) => issue.includes('Missing conversion'))
  const nextIssues = hasMissingConversion && !snapshot.issues.includes('Conversão não encontrada')
    ? [...snapshot.issues, 'Conversão não encontrada']
    : snapshot.issues

  const guardedSnapshot: InitiativeCalculationSnapshot = {
    ...snapshot,
    issues: nextIssues,
  }

  await calculationRepository.save(guardedSnapshot)
  await governanceRepository.logAudit({
    initiativeId: input.initiativeId,
    eventType: 'CALCULATION_EXECUTED',
    changedBy: 'system',
    payload: {
      issueCount: guardedSnapshot.issues.length,
      annual: guardedSnapshot.results[0]?.annualValue ?? 0,
    },
  })

  return guardedSnapshot
}
