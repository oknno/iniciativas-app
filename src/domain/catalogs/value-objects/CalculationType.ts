export const CALCULATION_TYPES = ['KPI_BASED', 'FIXED'] as const

export type CalculationType = (typeof CALCULATION_TYPES)[number]
