export const INITIATIVE_STATUSES = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'REJECTED'] as const

export type InitiativeStatusConstant = (typeof INITIATIVE_STATUSES)[number]
