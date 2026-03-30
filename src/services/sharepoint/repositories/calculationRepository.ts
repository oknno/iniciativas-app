import type { CalculationDetail } from '../../../domain/calculation/entities/CalculationDetail'
import type { CalculationResult, InitiativeCalculationSnapshot } from '../../../domain/calculation/entities/CalculationResult'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import {
  fromSharePointCalculationDetail,
  fromSharePointCalculationResult,
  initiativeIdToSharePointCalculation,
  toCalculationSnapshot,
  toSharePointCalculationDetailPayload,
  toSharePointCalculationResultPayload,
} from '../adapters/sharePointCalculationAdapter'
import {
  listByInitiativeId as listCalculationDetailsByInitiativeId,
  replaceForInitiative as replaceCalculationDetailsForInitiative,
} from '../lists/calculationDetailsListApi'
import {
  listByInitiativeId as listCalculationResultsByInitiativeId,
  replaceForInitiative as replaceCalculationResultsForInitiative,
} from '../lists/calculationResultsListApi'

export const calculationRepository = {
  async getCalculationResultByInitiativeId(initiativeId: InitiativeId): Promise<readonly CalculationResult[]> {
    const sharePointInitiativeId = initiativeIdToSharePointCalculation(initiativeId)
    const items = await listCalculationResultsByInitiativeId(sharePointInitiativeId)
    return items.map(fromSharePointCalculationResult)
  },

  async getCalculationDetailsByInitiativeId(initiativeId: InitiativeId): Promise<readonly CalculationDetail[]> {
    const sharePointInitiativeId = initiativeIdToSharePointCalculation(initiativeId)
    const items = await listCalculationDetailsByInitiativeId(sharePointInitiativeId)
    return items.map(fromSharePointCalculationDetail)
  },

  async replaceCalculationResultForInitiativeId(
    initiativeId: InitiativeId,
    results: readonly CalculationResult[],
  ): Promise<readonly CalculationResult[]> {
    const sharePointInitiativeId = initiativeIdToSharePointCalculation(initiativeId)
    const items = await replaceCalculationResultsForInitiative(sharePointInitiativeId, results.map(toSharePointCalculationResultPayload))
    return items.map(fromSharePointCalculationResult)
  },

  async replaceCalculationDetailsForInitiativeId(
    initiativeId: InitiativeId,
    details: readonly CalculationDetail[],
  ): Promise<readonly CalculationDetail[]> {
    const sharePointInitiativeId = initiativeIdToSharePointCalculation(initiativeId)
    const items = await replaceCalculationDetailsForInitiative(sharePointInitiativeId, details.map(toSharePointCalculationDetailPayload))
    return items.map(fromSharePointCalculationDetail)
  },

  async getByInitiativeId(initiativeId: InitiativeId): Promise<InitiativeCalculationSnapshot | undefined> {
    const [results, details] = await Promise.all([
      this.getCalculationResultByInitiativeId(initiativeId),
      this.getCalculationDetailsByInitiativeId(initiativeId),
    ])

    if (results.length === 0 && details.length === 0) {
      return undefined
    }

    return toCalculationSnapshot(initiativeId, results, details)
  },

  async save(snapshot: InitiativeCalculationSnapshot): Promise<void> {
    await Promise.all([
      this.replaceCalculationResultForInitiativeId(snapshot.initiativeId, snapshot.results),
      this.replaceCalculationDetailsForInitiativeId(snapshot.initiativeId, snapshot.details),
    ])
  },
}
