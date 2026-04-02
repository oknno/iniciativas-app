import type { ConversionValue } from '../../catalogs/entities/ConversionValue'
import type { FormulaTerm } from '../../catalogs/entities/FormulaTerm'
import type { CalculationDetail } from '../entities/CalculationDetail'
import type { CalculationResult, InitiativeCalculationSnapshot } from '../entities/CalculationResult'
import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'
import type { Scenario } from '../../initiatives/value-objects/Scenario'
import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'
import { validateComponentConfiguration } from '../services/calculationValidator'
import { CalculationContextFactory } from './CalculationContextFactory'
import { ComponentCalculator } from './ComponentCalculator'

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)

export const CalculationEngine = {
  run(input: {
    initiativeId: InitiativeComponent['initiativeId']
    year: number
    scenario: Scenario
    components: readonly InitiativeComponent[]
    formulaTerms: readonly FormulaTerm[]
    kpiValues: readonly SaveKpiValueDto[]
    fixedValues: readonly SaveComponentValueDto[]
    conversionValues: readonly ConversionValue[]
  }): InitiativeCalculationSnapshot {
    if (input.components.length === 0) {
      return {
        initiativeId: input.initiativeId,
        year: input.year,
        results: [],
        details: [],
        calculatedAt: new Date().toISOString(),
        issues: [],
      }
    }

    const issues: string[] = []

    input.components.forEach((component) => {
      issues.push(...validateComponentConfiguration(component))
    })

    const context = CalculationContextFactory.create({
      components: input.components,
      kpiValues: input.kpiValues,
      fixedValues: input.fixedValues,
      conversionValues: input.conversionValues,
      year: input.year,
      scenario: input.scenario,
    })

    const formulaTermsByCode = new Map<string, FormulaTerm[]>()
    input.formulaTerms.forEach((term) => {
      const current = formulaTermsByCode.get(term.formulaCode) ?? []
      current.push(term)
      formulaTermsByCode.set(term.formulaCode, current)
    })

    const details: CalculationDetail[] = []
    const gainByMonth = new Map<number, number>()

    MONTHS.forEach((month) => {
      const monthlyResults = input.components.map((component) =>
        ComponentCalculator.calculate({
          initiativeId: input.initiativeId,
          component,
          formulaTerms: component.formulaCode
            ? (formulaTermsByCode.get(component.formulaCode) ?? [])
              .filter((term) => !term.componentType || term.componentType === component.componentType)
              .sort((a, b) => a.order - b.order)
            : [],
          year: input.year,
          month,
          context,
        }),
      )

      monthlyResults.forEach((item) => {
        details.push(...item.details)
        issues.push(...item.issues)
      })

      monthlyResults.forEach((item, index) => {
        const component = input.components[index]
        console.info('[Calculation] resultado mensal por componente', {
          initiativeId: input.initiativeId,
          year: input.year,
          month,
          componentType: component.componentType,
          componentName: component.name,
          calculationType: component.calculationType,
          isValid: item.isValid,
          componentResult: item.componentResult,
          issues: item.issues,
        })
      })

      const gainValue = monthlyResults.filter((item) => item.isValid).reduce((sum, item) => sum + item.componentResult, 0)
      gainByMonth.set(month, gainValue)
    })

    const annualValue = Array.from(gainByMonth.values()).reduce((sum, value) => sum + value, 0)
    let accumulatedValue = 0

    const results: CalculationResult[] = MONTHS.map((month) => {
      const gainValue = gainByMonth.get(month) ?? 0
      accumulatedValue += gainValue

      return {
        initiativeId: input.initiativeId,
        year: input.year,
        month,
        gainValue,
        accumulatedValue,
        annualValue,
      }
    })

    return {
      initiativeId: input.initiativeId,
      year: input.year,
      results,
      details,
      calculatedAt: new Date().toISOString(),
      issues: [...new Set(issues)],
    }
  },
}
