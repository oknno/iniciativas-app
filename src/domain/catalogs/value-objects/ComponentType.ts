export const COMPONENT_TYPES = ['ENERGY', 'MATERIAL', 'LOGISTICS', 'LABOR', 'OTHER'] as const

export type ComponentType = (typeof COMPONENT_TYPES)[number]
