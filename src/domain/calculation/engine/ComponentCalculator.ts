import type { FormulaTerm } from '../../catalogs/entities/FormulaTerm'
import type { CalculationDetail } from '../entities/CalculationDetail'
import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'
import { applyDirection } from '../rules/calculationRules'
import { resolveMissingFixedValue, resolveMissingKpiValue } from '../rules/missingDataRules'
import { explainFixedValue, explainKpiMultiplier } from '../services/calculationExplainer'
import { CalculationContextFactory, type CalculationContext } from './CalculationContextFactory'
import { asFormulaCode } from '../../catalogs/value-objects/FormulaCode'

export interface ComponentCalculationOutput {
  readonly details: readonly CalculationDetail[]
  readonly componentResult: number
  readonly issues: readonly string[]
  readonly isValid: boolean
}

const calculateTermValue = (input: {
  component: InitiativeComponent
  term: FormulaTerm
  context: CalculationContext
  monthRef: string
  initiativeId: InitiativeComponent['initiativeId']
}): {
  readonly baseValue: number
  readonly conversionValue: number
  readonly resultValue: number
  readonly explanation: string
  readonly issues: readonly string[]
  readonly missingConversion: boolean
} => {
  const issues: string[] = []
  const { component, term, context, monthRef, initiativeId } = input

  if (term.calculationType === 'FIXED') {
    const baseValue = context.fixedValuesByKey.get(CalculationContextFactory.keys.toFixedKey(component.id, monthRef)) ?? resolveMissingFixedValue()
    const resultValue = baseValue * term.signal
    return {
      baseValue,
      conversionValue: 1,
      resultValue,
      explanation: explainFixedValue(component),
      issues,
      missingConversion: false,
    }
  }

  const kpiValue = context.kpiValuesByKey.get(CalculationContextFactory.keys.toKpiKey(component.id, monthRef)) ?? resolveMissingKpiValue()

  if (!term.conversionCode) {
    const issue = `Missing conversion reference for formula term ${term.formulaCode} (${component.name})`
    issues.push(issue)
    return {
      baseValue: kpiValue,
      conversionValue: 0,
      resultValue: 0,
      explanation: issue,
      issues,
      missingConversion: true,
    }
  }

  const conversionKey = CalculationContextFactory.keys.toConversionKey(term.conversionCode, monthRef)
  const initiativeConversion = context.conversionValuesByInitiativeKey.get(`${initiativeId}|${conversionKey}`)
  const globalConversion = context.conversionValuesByGlobalKey.get(conversionKey)
  const resolvedConversion = initiativeConversion ?? globalConversion

  if (resolvedConversion === undefined) {
    const issue = `Missing conversion value for ${term.conversionCode} (${monthRef}) on component ${component.name}`
    issues.push(issue)
    return {
      baseValue: kpiValue,
      conversionValue: 0,
      resultValue: 0,
      explanation: issue,
      issues,
      missingConversion: true,
    }
  }

  const resultValue = kpiValue * resolvedConversion * term.signal
  return {
    baseValue: kpiValue,
    conversionValue: resolvedConversion,
    resultValue,
    explanation: explainKpiMultiplier(component),
    issues,
    missingConversion: false,
  }
}

export const ComponentCalculator = {
  calculate(input: {
    initiativeId: InitiativeComponent['initiativeId']
    component: InitiativeComponent
    formulaTerms: readonly FormulaTerm[]
    year: number
    month: number
    context: CalculationContext
  }): ComponentCalculationOutput {
    const { component, year, month, context, formulaTerms } = input
    const monthRef = CalculationContextFactory.buildMonthRef(year, month)
    const issues: string[] = []

    const formulaCode = component.formulaCode
    if (!formulaCode) {
      const issue = `Missing formula for component ${component.name}`
      return {
        details: [
          {
            initiativeId: input.initiativeId,
            componentType: component.componentType,
            year,
            month,
            formulaCode: asFormulaCode('FORMULA-DIRECT-VALUE'),
            direction: component.direction,
            rawValue: 0,
            signedValue: 0,
            baseValue: 0,
            conversionValue: 0,
            resultValue: 0,
            kpiCode: component.kpiCode,
            conversionCode: component.conversionCode,
            sourceType: component.calculationType,
            explanation: issue,
          },
        ],
        componentResult: 0,
        issues: [issue],
        isValid: false,
      }
    }

    const terms = formulaTerms.length > 0
      ? formulaTerms
      : [{
        formulaCode,
        order: 1,
        operation: 'ADD',
        signal: 1,
        calculationType: component.calculationType,
        kpiCode: component.kpiCode,
        conversionCode: component.conversionCode,
      } satisfies FormulaTerm]

    let result = 0
    let isValid = true

    const details = terms.map((term) => {
      const termOutput = calculateTermValue({
        component,
        term,
        context,
        monthRef,
        initiativeId: input.initiativeId,
      })

      issues.push(...termOutput.issues)

      if (termOutput.missingConversion) {
        isValid = false
      }

      if (term.operation === 'SUBTRACT') {
        result -= termOutput.resultValue
      } else {
        result += termOutput.resultValue
      }

      return {
        initiativeId: input.initiativeId,
        componentType: component.componentType,
        year,
        month,
        formulaCode: term.formulaCode,
        direction: component.direction,
        rawValue: termOutput.resultValue,
        signedValue: applyDirection(termOutput.resultValue, component.direction),
        baseValue: termOutput.baseValue,
        conversionValue: termOutput.conversionValue,
        resultValue: termOutput.resultValue,
        kpiCode: term.kpiCode ?? component.kpiCode,
        conversionCode: term.conversionCode ?? component.conversionCode,
        sourceType: term.calculationType,
        explanation: termOutput.explanation,
      } satisfies CalculationDetail
    })

    if (!isValid) {
      return {
        details,
        componentResult: 0,
        issues,
        isValid: false,
      }
    }

    return {
      details,
      componentResult: applyDirection(result, component.direction),
      issues,
      isValid: true,
    }
  },
}
