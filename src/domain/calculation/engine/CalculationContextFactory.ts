import type { ConversionValue } from '../../catalogs/entities/ConversionValue'
import type { InitiativeComponent } from '../../initiatives/entities/InitiativeComponent'
import type { Scenario } from '../../initiatives/value-objects/Scenario'
import type { SaveComponentValueDto } from '../../../application/dto/initiatives/SaveComponentValueDto'
import type { SaveKpiValueDto } from '../../../application/dto/initiatives/SaveKpiValueDto'
import { DEFAULT_MONTH_POLICY, resolveCalculationMonths, type MonthPolicy } from '../rules/monthPolicy'

export interface CalculationContext {
  readonly components: readonly InitiativeComponent[]
  readonly months: readonly number[]
  readonly kpiValuesByKey: ReadonlyMap<string, number>
  readonly fixedValuesByKey: ReadonlyMap<string, number>
  readonly conversionValuesByInitiativeKey: ReadonlyMap<string, number>
  readonly conversionValuesByGlobalKey: ReadonlyMap<string, number>
}

const buildMonthKey = (year: number, month: number): string => `${year}-${String(month).padStart(2, '0')}`

const toKpiKey = (componentId: string, monthRef: string): string => `${componentId}|${monthRef}`
const toFixedKey = (componentId: string, monthRef: string): string => `${componentId}|${monthRef}`
const toConversionKey = (conversionCode: string, monthRef: string): string => `${conversionCode}|${monthRef}`

const buildComponentIdAliasMap = (components: readonly InitiativeComponent[]): ReadonlyMap<string, string> => {
  const aliases = new Map<string, string>()
  components.forEach((component) => {
    aliases.set(component.id, component.id)
    aliases.set(component.componentType, component.id)
  })
  return aliases
}

export const CalculationContextFactory = {
  create(input: {
    components: readonly InitiativeComponent[]
    kpiValues: readonly SaveKpiValueDto[]
    fixedValues: readonly SaveComponentValueDto[]
    conversionValues: readonly ConversionValue[]
    year: number
    scenario: Scenario
    monthPolicy?: MonthPolicy
  }): CalculationContext {
    const resolvedMonths = resolveCalculationMonths({
      year: input.year,
      policy: input.monthPolicy ?? DEFAULT_MONTH_POLICY,
      kpiValues: input.kpiValues,
      fixedValues: input.fixedValues,
      conversionValues: input.conversionValues,
    })
    const months = new Set(resolvedMonths.map((month) => buildMonthKey(input.year, month)))
    const componentIdAliases = buildComponentIdAliasMap(input.components)

    const kpiValuesByKey = new Map<string, number>()
    input.kpiValues
      .filter((item) => item.scenario === input.scenario && months.has(item.monthRef))
      .forEach((item) => {
        const componentId = componentIdAliases.get(item.componentId) ?? item.componentId
        kpiValuesByKey.set(toKpiKey(componentId, item.monthRef), item.value)
      })

    const fixedValuesByKey = new Map<string, number>()
    input.fixedValues
      .filter((item) => item.scenario === input.scenario && months.has(item.monthRef))
      .forEach((item) => {
        const componentId = componentIdAliases.get(item.componentId) ?? item.componentId
        fixedValuesByKey.set(toFixedKey(componentId, item.monthRef), item.baseValue)
      })

    const conversionValuesByInitiativeKey = new Map<string, number>()
    const conversionValuesByGlobalKey = new Map<string, number>()
    input.conversionValues
      .filter((item) => item.scenario === input.scenario && months.has(item.monthRef))
      .forEach((item) => {
        const key = toConversionKey(item.conversionCode, item.monthRef)
        if (item.initiativeId) {
          conversionValuesByInitiativeKey.set(`${item.initiativeId}|${key}`, item.value)
          return
        }

        conversionValuesByGlobalKey.set(key, item.value)
      })

    return {
      components: input.components,
      months: resolvedMonths,
      kpiValuesByKey,
      fixedValuesByKey,
      conversionValuesByInitiativeKey,
      conversionValuesByGlobalKey,
    }
  },

  buildMonthRef: buildMonthKey,
  keys: {
    toKpiKey,
    toFixedKey,
    toConversionKey,
  },
}
