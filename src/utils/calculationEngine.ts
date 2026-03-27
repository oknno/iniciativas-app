import type {
  ComponentValueInput,
  ConversionValue,
  KpiValueInput,
  MonthlyGainResult,
} from '../types/calculation'
import type { ComponentMaster } from '../types/component'
import type { InitiativeComponent } from '../types/initiativeComponent'

function periodKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`
}

function collectPeriods(
  kpiValues: KpiValueInput[],
  componentValues: ComponentValueInput[],
  conversionValues: ConversionValue[],
): Array<{ year: number; month: number }> {
  const periodMap = new Map<string, { year: number; month: number }>()

  for (const item of [...kpiValues, ...componentValues, ...conversionValues]) {
    periodMap.set(periodKey(item.year, item.month), { year: item.year, month: item.month })
  }

  return [...periodMap.values()].sort((a, b) => periodKey(a.year, a.month).localeCompare(periodKey(b.year, b.month)))
}

export function calculateMonthlyGain(input: {
  initiativeId: number
  initiativeComponents: InitiativeComponent[]
  componentMasterCatalog: ComponentMaster[]
  kpiValues: KpiValueInput[]
  componentValues: ComponentValueInput[]
  conversionValues: ConversionValue[]
}): MonthlyGainResult[] {
  const {
    initiativeId,
    initiativeComponents,
    componentMasterCatalog,
    kpiValues,
    componentValues,
    conversionValues,
  } = input

  if (initiativeComponents.length === 0) {
    return []
  }

  const periods = collectPeriods(kpiValues, componentValues, conversionValues)

  return periods.map(({ year, month }) => {
    let gainValue = 0

    const components = initiativeComponents.map((item) => {
      const master = componentMasterCatalog.find((component) => component.componentType === item.componentType)
      if (!master) {
        throw new Error(`Componente ${item.componentType} não encontrado no catálogo.`)
      }

      let componentValue = 0

      if (master.calculationType === 'KPI_BASED') {
        const kpiValue = kpiValues.find(
          (value) =>
            value.kpiCode === item.kpiCode &&
            value.year === year &&
            value.month === month,
        )?.value ?? 0

        const conversionValue = conversionValues.find(
          (value) =>
            value.conversionCode === item.conversionCode &&
            value.year === year &&
            value.month === month,
        )

        if (!conversionValue) {
          throw new Error(
            `Erro de configuração: conversão ${item.conversionCode} ausente em ${periodKey(year, month)}.`,
          )
        }

        componentValue = kpiValue * conversionValue.value
      } else {
        componentValue = componentValues.find(
          (value) =>
            value.componentType === item.componentType &&
            value.year === year &&
            value.month === month,
        )?.value ?? 0
      }

      const signedValue = componentValue * master.direction
      gainValue += signedValue

      return {
        componentType: item.componentType,
        year,
        month,
        componentValue,
        signedValue,
      }
    })

    return {
      initiativeId,
      year,
      month,
      gainValue,
      components,
    }
  })
}
