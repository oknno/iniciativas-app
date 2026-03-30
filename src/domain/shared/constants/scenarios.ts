export const SCENARIOS = ['BASE', 'BEST', 'WORST'] as const

export type ScenarioConstant = (typeof SCENARIOS)[number]
