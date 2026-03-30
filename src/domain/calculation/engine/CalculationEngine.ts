import type { ConversionValue } from '../../catalogs/entities/ConversionValue'
import type { CalculationDetail } from '../entities/CalculationDetail'
import type { CalculationResult, InitiativeCalculationSnapshot } from '../entities/CalculationResult'
import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'
import type { Scenario } from '../../initiatives/value-objects/Scenario'
import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'
import { sumGainValues } from '../rules/calculationRules'
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

    const details: CalculationDetail[] = []
    const results: CalculationResult[] = []

    MONTHS.forEach((month) => {
      const monthlyDetails = input.components.map((component) =>
        ComponentCalculator.calculate({
          initiativeId: input.initiativeId,
          component,
          year: input.year,
          month,
          context,
        }),
      )

      monthlyDetails.forEach((item) => {
        details.push(item.detail)
        issues.push(...item.issues)
      })

      results.push({
        initiativeId: input.initiativeId,
        year: input.year,
        month,
        gainValue: sumGainValues(monthlyDetails.map((item) => item.detail.signedValue)),
      })
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
