export const SCENARIOS = ['PESSIMISTA', 'BASE', 'OTIMISTA'] as const

export type ScenarioConstant = (typeof SCENARIOS)[number]
