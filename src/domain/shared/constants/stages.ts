export const INITIATIVE_STAGES = ['DRAFTING', 'ASSESSMENT', 'VALIDATION', 'GOVERNANCE_GATE'] as const

export type InitiativeStageConstant = (typeof INITIATIVE_STAGES)[number]
