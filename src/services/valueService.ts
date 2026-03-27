import type {
  ComponentValueInput,
  ConversionValue,
  KpiValueInput,
} from '../types/calculation'
import type { ConversionCode } from '../types/conversion'

const kpiValuesStore = new Map<number, KpiValueInput[]>([
  [
    1,
    [
      { initiativeId: 1, kpiCode: 'FTE_REDUCTION', year: 2024, month: 1, value: 1.8 },
      { initiativeId: 1, kpiCode: 'FTE_REDUCTION', year: 2025, month: 1, value: 2.1 },
      { initiativeId: 1, kpiCode: 'FTE_REDUCTION', year: 2026, month: 1, value: 2.2 },
      { initiativeId: 1, kpiCode: 'FTE_REDUCTION', year: 2026, month: 2, value: 2.3 },
    ],
  ],
])

const componentValuesStore = new Map<number, ComponentValueInput[]>([
  [
    1,
    [
      { initiativeId: 1, componentType: 'SOFTWARE_COST', year: 2026, month: 1, value: 10000 },
      { initiativeId: 1, componentType: 'SOFTWARE_COST', year: 2026, month: 2, value: 10000 },
    ],
  ],
])

function buildYearlySeries(
  conversionCode: ConversionCode,
  year: number,
  base: number,
  variation: number,
): ConversionValue[] {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    const seasonal = month <= 6 ? 1 : 1.02
    return {
      conversionCode,
      year,
      month,
      value: Number((base + variation * month * seasonal).toFixed(3)),
    }
  })
}

const conversionValuesStore: ConversionValue[] = [
  ...buildYearlySeries('COST_PER_FTE', 2024, 4200, 10),
  ...buildYearlySeries('COST_PER_FTE', 2025, 4550, 9),
  ...buildYearlySeries('COST_PER_FTE', 2026, 4700, 8),
  ...buildYearlySeries('PRICE_PER_TON', 2024, 295, 0.6),
  ...buildYearlySeries('PRICE_PER_TON', 2025, 312, 0.55),
  ...buildYearlySeries('PRICE_PER_TON', 2026, 330, 0.5),
]

export async function listKpiValues(initiativeId: number): Promise<KpiValueInput[]> {
  return Promise.resolve(kpiValuesStore.get(initiativeId) ?? [])
}

export async function saveKpiValue(payload: KpiValueInput): Promise<void> {
  const current = kpiValuesStore.get(payload.initiativeId) ?? []
  const filtered = current.filter(
    (item) => !(item.kpiCode === payload.kpiCode && item.year === payload.year && item.month === payload.month),
  )
  kpiValuesStore.set(payload.initiativeId, [...filtered, payload])
  return Promise.resolve()
}

export async function listComponentValues(initiativeId: number): Promise<ComponentValueInput[]> {
  return Promise.resolve(componentValuesStore.get(initiativeId) ?? [])
}

export async function saveComponentValue(payload: ComponentValueInput): Promise<void> {
  const current = componentValuesStore.get(payload.initiativeId) ?? []
  const filtered = current.filter(
    (item) => !(item.componentType === payload.componentType && item.year === payload.year && item.month === payload.month),
  )
  componentValuesStore.set(payload.initiativeId, [...filtered, payload])
  return Promise.resolve()
}

export async function listConversionValues(): Promise<ConversionValue[]> {
  return Promise.resolve([...conversionValuesStore])
}

export async function saveConversionValue(payload: ConversionValue): Promise<void> {
  const index = conversionValuesStore.findIndex(
    (item) =>
      item.conversionCode === payload.conversionCode &&
      item.year === payload.year &&
      item.month === payload.month,
  )

  if (index >= 0) {
    conversionValuesStore[index] = payload
  } else {
    conversionValuesStore.push(payload)
  }

  return Promise.resolve()
}
