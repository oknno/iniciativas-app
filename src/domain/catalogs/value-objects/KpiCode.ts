export type KpiCode = string & { readonly __brand: 'KpiCode' }

export const asKpiCode = (value: string): KpiCode => value as KpiCode
