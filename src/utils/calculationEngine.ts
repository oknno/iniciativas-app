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

function createValueIndex<T extends { year: number, month: number, value: number }>(
  values: T[],
  keyBuilder: (value: T) => string,
): Map<string, number> {
  return values.reduce((index, item) => {
    index.set(`${keyBuilder(item)}-${periodKey(item.year, item.month)}`, item.value)
    return index
  }, new Map<string, number>())
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
  const componentMasterByType = new Map(
    componentMasterCatalog.map((component) => [component.componentType, component]),
  )
  const kpiValueIndex = createValueIndex(kpiValues, (value) => value.kpiCode)
  const conversionValueIndex = createValueIndex(conversionValues, (value) => value.conversionCode)
  const componentValueIndex = createValueIndex(componentValues, (value) => value.componentType)

  return periods.map(({ year, month }) => {
    let gainValue = 0
    const currentPeriodKey = periodKey(year, month)

    const components = initiativeComponents.map((item) => {
      const master = componentMasterByType.get(item.componentType)
      if (!master) {
        throw new Error(`Componente ${item.componentType} não encontrado no catálogo.`)
      }

      let componentValue = 0

      if (master.calculationType === 'KPI_BASED') {
        const kpiValue = kpiValueIndex.get(`${item.kpiCode}-${currentPeriodKey}`) ?? 0
        const conversionValue = conversionValueIndex.get(`${item.conversionCode}-${currentPeriodKey}`)

        if (conversionValue === undefined) {
          throw new Error(
            `Erro de configuração: conversão ${item.conversionCode} ausente em ${periodKey(year, month)}.`,
          )
        }

        componentValue = kpiValue * conversionValue
      } else {
        componentValue = componentValueIndex.get(`${item.componentType}-${currentPeriodKey}`) ?? 0
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
