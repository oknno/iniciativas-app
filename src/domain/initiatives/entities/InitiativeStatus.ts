export const INITIATIVE_STATUSES = [
  'DRAFT_OWNER',
  'IN_REVIEW_LOCAL',
  'RETURNED_TO_OWNER',
  'LOCAL_APPROVED',
  'IN_REVIEW_STRATEGIC',
  'STRATEGIC_APPROVED',
  'STRATEGIC_REJECTED',
] as const

export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number]

export const STATUS_LABELS_PT_BR: Readonly<Record<InitiativeStatus, string>> = {
  DRAFT_OWNER: 'Rascunho (Owner)',
  IN_REVIEW_LOCAL: 'Em revisão local',
  RETURNED_TO_OWNER: 'Devolvida para ajustes',
  LOCAL_APPROVED: 'Aprovada localmente',
  IN_REVIEW_STRATEGIC: 'Em revisão estratégica',
  STRATEGIC_APPROVED: 'Aprovada estrategicamente',
  STRATEGIC_REJECTED: 'Rejeitada estrategicamente',
}

const ALLOWED_TRANSITIONS: Readonly<Record<InitiativeStatus, readonly InitiativeStatus[]>> = {
  DRAFT_OWNER: ['IN_REVIEW_LOCAL'],
  IN_REVIEW_LOCAL: ['RETURNED_TO_OWNER', 'LOCAL_APPROVED'],
  RETURNED_TO_OWNER: ['IN_REVIEW_LOCAL'],
  LOCAL_APPROVED: ['IN_REVIEW_STRATEGIC'],
  IN_REVIEW_STRATEGIC: ['STRATEGIC_APPROVED', 'STRATEGIC_REJECTED'],
  STRATEGIC_APPROVED: [],
  STRATEGIC_REJECTED: [],
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
