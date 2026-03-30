import type { InitiativeId } from '../../initiatives/value-objects/InitiativeId'

export interface CalculationResult {
  readonly initiativeId: InitiativeId
  readonly year: number
  readonly month: number
  readonly gainValue: number
}

export interface InitiativeCalculationSnapshot {
  readonly initiativeId: InitiativeId
  readonly year: number
  readonly results: readonly CalculationResult[]
  readonly details: readonly import('./CalculationDetail').CalculationDetail[]
  readonly calculatedAt: string
  readonly issues: readonly string[]
}
