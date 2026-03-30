import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const calculationState = new Map<InitiativeId, InitiativeCalculationSnapshot>()

const clone = <T>(value: T): T => structuredClone(value)

export const calculationRepository = {
  async save(snapshot: InitiativeCalculationSnapshot): Promise<void> {
    await wait(100)
    calculationState.set(snapshot.initiativeId, clone(snapshot))
  },

  async getByInitiativeId(initiativeId: InitiativeId): Promise<InitiativeCalculationSnapshot | undefined> {
    await wait(60)
    const value = calculationState.get(initiativeId)
    return value ? clone(value) : undefined
  },
}
