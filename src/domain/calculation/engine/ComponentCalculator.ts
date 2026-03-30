import type { CalculationDetail } from '../entities/CalculationDetail'
import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'
import { applyDirection } from '../rules/calculationRules'
import { resolveMissingConversionValue, resolveMissingFixedValue, resolveMissingKpiValue } from '../rules/missingDataRules'
import { explainFixedValue, explainKpiMultiplier, explainMissingConversion } from '../services/calculationExplainer'
import { FormulaResolver } from './FormulaResolver'
import { CalculationContextFactory, type CalculationContext } from './CalculationContextFactory'
import { asFormulaCode } from '../../catalogs/value-objects/FormulaCode'

export interface ComponentCalculationOutput {
  readonly detail: CalculationDetail
  readonly issues: readonly string[]
}

export const ComponentCalculator = {
  calculate(input: {
    initiativeId: InitiativeComponent['initiativeId']
    component: InitiativeComponent
    year: number
    month: number
    context: CalculationContext
  }): ComponentCalculationOutput {
    const { component, year, month, context } = input
    const monthRef = CalculationContextFactory.buildMonthRef(year, month)
    const issues: string[] = []

    const formulaCode = component.formulaCode
    if (!formulaCode) {
      return {
        detail: {
          initiativeId: input.initiativeId,
          componentType: component.componentType,
          year,
          month,
          formulaCode: asFormulaCode('FORMULA-DIRECT-VALUE'),
          direction: component.direction,
          rawValue: 0,
          signedValue: 0,
          kpiCode: component.kpiCode,
          conversionCode: component.conversionCode,
          sourceType: component.calculationType,
          explanation: `Missing formula for ${component.name}`,
        },
        issues: [`Missing formula for component ${component.name}`],
      }
    }

    let rawValue = 0
    let explanation = ''

    if (component.calculationType === 'KPI_BASED') {
      const kpiValue = context.kpiValuesByKey.get(CalculationContextFactory.keys.toKpiKey(component.id, monthRef)) ?? resolveMissingKpiValue()
      const conversionCode = component.conversionCode

      if (!conversionCode) {
        issues.push(`Missing conversion reference for component ${component.name}`)
        explanation = `Missing conversion reference for ${component.name}`
      } else {
        const conversionValue = context.conversionValuesByKey.get(CalculationContextFactory.keys.toConversionKey(conversionCode, monthRef))

        if (conversionValue === undefined) {
          const missing = resolveMissingConversionValue(conversionCode)
          issues.push(missing.issue)
          rawValue = FormulaResolver.calculate({ formulaCode, kpiValue, conversionValue: missing.value })
          explanation = explainMissingConversion(conversionCode)
        } else {
          rawValue = FormulaResolver.calculate({ formulaCode, kpiValue, conversionValue })
          explanation = explainKpiMultiplier(component)
        }
      }
    } else {
      const fixedValue = context.fixedValuesByKey.get(CalculationContextFactory.keys.toFixedKey(component.id, monthRef)) ?? resolveMissingFixedValue()
      rawValue = FormulaResolver.calculate({ formulaCode, fixedValue })
      explanation = explainFixedValue(component)
    }

    const signedValue = applyDirection(rawValue, component.direction)

    return {
      detail: {
        initiativeId: input.initiativeId,
        componentType: component.componentType,
        year,
        month,
        formulaCode,
        direction: component.direction,
        rawValue,
        signedValue,
        kpiCode: component.kpiCode,
        conversionCode: component.conversionCode,
        sourceType: component.calculationType,
        explanation,
      },
      issues,
    }
  },
}
