export type InitiativeId = string & { readonly __brand: 'InitiativeId' }

export const asInitiativeId = (value: string): InitiativeId => value as InitiativeId
