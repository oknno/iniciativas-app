export const INITIATIVE_STATUSES = [
  'Em preenchimento',
  'Em revisão',
  'Em validação',
  'Aprovada',
  'Reprovada',
  'Devolvida',
] as const

export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number]

const ALLOWED_TRANSITIONS: Readonly<Record<InitiativeStatus, readonly InitiativeStatus[]>> = {
  'Em preenchimento': ['Em revisão'],
  'Em revisão': ['Em validação'],
  'Em validação': ['Aprovada', 'Reprovada'],
  Aprovada: [],
  Reprovada: ['Em preenchimento'],
  Devolvida: ['Em preenchimento'],
}

export const isInitiativeStatus = (value: string): value is InitiativeStatus =>
  INITIATIVE_STATUSES.includes(value as InitiativeStatus)

export const isStatusTransitionAllowed = (from: InitiativeStatus, to: InitiativeStatus): boolean =>
  ALLOWED_TRANSITIONS[from].includes(to)
