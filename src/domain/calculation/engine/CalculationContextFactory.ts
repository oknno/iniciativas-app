import type { ConversionValue } from '../../catalogs/entities/ConversionValue'
import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'
import type { Scenario } from '../../initiatives/value-objects/Scenario'
import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'

export interface CalculationContext {
  readonly components: readonly InitiativeComponent[]
  readonly kpiValuesByKey: ReadonlyMap<string, number>
  readonly fixedValuesByKey: ReadonlyMap<string, number>
  readonly conversionValuesByKey: ReadonlyMap<string, number>
}

const buildMonthKey = (year: number, month: number): string => `${year}-${String(month).padStart(2, '0')}`

const toKpiKey = (componentId: string, monthRef: string): string => `${componentId}|${monthRef}`
const toFixedKey = (componentId: string, monthRef: string): string => `${componentId}|${monthRef}`
const toConversionKey = (conversionCode: string, monthRef: string): string => `${conversionCode}|${monthRef}`

export const CalculationContextFactory = {
  create(input: {
    components: readonly InitiativeComponent[]
    kpiValues: readonly SaveKpiValueDto[]
    fixedValues: readonly SaveComponentValueDto[]
    conversionValues: readonly ConversionValue[]
    year: number
    scenario: Scenario
  }): CalculationContext {
    const months = new Set(Array.from({ length: 12 }, (_, index) => buildMonthKey(input.year, index + 1)))

    const kpiValuesByKey = new Map<string, number>()
    input.kpiValues
      .filter((item) => item.scenario === input.scenario && months.has(item.monthRef))
      .forEach((item) => {
        kpiValuesByKey.set(toKpiKey(item.componentId, item.monthRef), item.value)
      })

    const fixedValuesByKey = new Map<string, number>()
    input.fixedValues
      .filter((item) => item.scenario === input.scenario && months.has(item.monthRef))
      .forEach((item) => {
        fixedValuesByKey.set(toFixedKey(item.componentId, item.monthRef), item.baseValue)
      })

    const conversionValuesByKey = new Map<string, number>()
    input.conversionValues
      .filter((item) => item.scenario === input.scenario && months.has(item.monthRef))
      .forEach((item) => {
        conversionValuesByKey.set(toConversionKey(item.conversionCode, item.monthRef), item.value)
      })

    return {
      components: input.components,
      kpiValuesByKey,
      fixedValuesByKey,
      conversionValuesByKey,
    }
  },

  buildMonthRef: buildMonthKey,
  keys: {
    toKpiKey,
    toFixedKey,
    toConversionKey,
  },
}
