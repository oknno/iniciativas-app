export const INITIATIVE_STATUSES = [
  'DRAFT_OWNER',
  'IN_REVIEW_LOCAL',
  'RETURNED_TO_OWNER',
  'IN_REVIEW_STRATEGIC',
  'STRATEGIC_APPROVED',
] as const

export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number]

export const STATUS_LABELS_PT_BR: Readonly<Record<InitiativeStatus, string>> = {
  DRAFT_OWNER: 'Rascunho (Owner)',
  IN_REVIEW_LOCAL: 'Em revisão local',
  RETURNED_TO_OWNER: 'Devolvida para ajustes',
  IN_REVIEW_STRATEGIC: 'Em revisão estratégica',
  STRATEGIC_APPROVED: 'Aprovada',
}

const ALLOWED_TRANSITIONS: Readonly<Record<InitiativeStatus, readonly InitiativeStatus[]>> = {
  DRAFT_OWNER: ['IN_REVIEW_LOCAL'],
  IN_REVIEW_LOCAL: ['RETURNED_TO_OWNER', 'IN_REVIEW_STRATEGIC'],
  RETURNED_TO_OWNER: ['IN_REVIEW_LOCAL'],
  IN_REVIEW_STRATEGIC: ['RETURNED_TO_OWNER', 'STRATEGIC_APPROVED'],
  STRATEGIC_APPROVED: [],
}

export const isInitiativeStatus = (value: string): value is InitiativeStatus =>
  INITIATIVE_STATUSES.includes(value as InitiativeStatus)

export const isStatusTransitionAllowed = (from: InitiativeStatus, to: InitiativeStatus): boolean =>
  ALLOWED_TRANSITIONS[from].includes(to)

export const toInitiativeStatusLabelPtBr = (status: string): string => {
  if (!isInitiativeStatus(status)) {
    return status
  }

  return STATUS_LABELS_PT_BR[status]
}
