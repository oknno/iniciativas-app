import type {
  ComponentValueInput,
  ConversionValue,
  KpiValueInput,
} from '../types/calculation'

const kpiValuesStore = new Map<number, KpiValueInput[]>([
  [
    1,
    [
      { initiativeId: 1, kpiCode: 'FTE_REDUCTION', year: 2026, month: 1, value: 2 },
      { initiativeId: 1, kpiCode: 'FTE_REDUCTION', year: 2026, month: 2, value: 2 },
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

const conversionValuesStore: ConversionValue[] = [
  { conversionCode: 'COST_PER_FTE', year: 2026, month: 1, value: 5000 },
  { conversionCode: 'COST_PER_FTE', year: 2026, month: 2, value: 5000 },
  { conversionCode: 'COST_PER_KWH', year: 2026, month: 1, value: 0.5 },
  { conversionCode: 'COST_PER_KWH', year: 2026, month: 2, value: 0.5 },
  { conversionCode: 'PRICE_PER_TON', year: 2026, month: 1, value: 300 },
  { conversionCode: 'PRICE_PER_TON', year: 2026, month: 2, value: 300 },
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
