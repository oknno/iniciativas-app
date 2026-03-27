import type {
  CalculationPeriod,
  InitiativeCalculationComponentConfig,
  InitiativeCalculationInput,
  InitiativeComponentMonthlyResult,
  InitiativeMonthlyGainResult,
  MonthlyMetricValues,
} from '../types/calculation'

function getMetricValue(values: MonthlyMetricValues, period: CalculationPeriod, metricId?: number) {
  if (metricId == null) {
    return { value: 0, usedDefaultZero: true }
  }

  const value = values[period]?.[metricId]
  if (value == null) {
    return { value: 0, usedDefaultZero: true }
  }

  return { value, usedDefaultZero: false }
}

function calculateComponentValue(
  component: InitiativeCalculationComponentConfig,
  period: CalculationPeriod,
  input: InitiativeCalculationInput,
): InitiativeComponentMonthlyResult {
  const { monthlyValues } = input

  if (component.calculationType === 'KPI_BASED' && component.formulaType === 'MULTIPLIER') {
    const kpi = getMetricValue(monthlyValues.kpiValues, period, component.kpiId)
    const conversion = getMetricValue(monthlyValues.conversionValues, period, component.conversionId)

    if (component.conversionId != null && conversion.usedDefaultZero) {
      throw new Error(
        `Configuração inválida: conversão ${component.conversionId} ausente para o mês ${period}.`,
      )
    }

    const rawValue = kpi.value * conversion.value
    const finalValue = rawValue * component.direction

    return {
      componentId: component.componentId,
      period,
      direction: component.direction,
      rawValue,
      conversionValue: conversion.value,
      finalValue,
      usedDefaultZero: kpi.usedDefaultZero,
    }
  }

  if (component.calculationType === 'FIXED' && component.formulaType === 'DIRECT_VALUE') {
    const componentValue = getMetricValue(monthlyValues.componentValues, period, component.componentId)
    const rawValue = componentValue.value

    return {
      componentId: component.componentId,
      period,
      direction: component.direction,
      rawValue,
      finalValue: rawValue * component.direction,
      usedDefaultZero: componentValue.usedDefaultZero,
    }
  }

  throw new Error(
    `Configuração inválida no componente ${component.componentId}: combinação ${component.calculationType} + ${component.formulaType} não suportada.`,
  )
}

export function calculateInitiativeMonthlyGain(
  input: InitiativeCalculationInput,
): InitiativeMonthlyGainResult[] {
  const components = input.configuration.components

  if (!components.length) {
    return []
  }

  const periods = new Set<CalculationPeriod>([
    ...Object.keys(input.monthlyValues.kpiValues),
    ...Object.keys(input.monthlyValues.componentValues),
    ...Object.keys(input.monthlyValues.conversionValues),
  ])

  return [...periods]
    .sort()
    .map((period) => {
      const componentResults = components.map((component) =>
        calculateComponentValue(component, period, input),
      )

      const monthlyGain = componentResults.reduce((sum, component) => sum + component.finalValue, 0)

      return {
        initiativeId: input.initiativeId,
        period,
        componentResults,
        monthlyGain,
      }
    })
}
