import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { createAuditLog } from '../lists/auditLogListApi'
import { createStatusHistory } from '../lists/initiativeStatusHistoryListApi'

const toInitiativeIdText = (initiativeId: InitiativeId): string => String(initiativeId)

export const governanceRepository = {
  async logAudit(input: {
    readonly initiativeId: InitiativeId
    readonly eventType: string
    readonly changedBy: string
    readonly payload?: object
  }): Promise<void> {
    await createAuditLog({
      Title: input.eventType,
      InitiativeId: toInitiativeIdText(input.initiativeId),
      EventType: input.eventType,
      ChangedBy: input.changedBy,
      PayloadJson: input.payload ? JSON.stringify(input.payload) : undefined,
    })
  },

  async addStatusHistory(input: {
    readonly initiativeId: InitiativeId
    readonly from: string
    readonly to: string
    readonly changedBy: string
    readonly comment?: string
  }): Promise<void> {
    await createStatusHistory({
      Title: `${input.from} -> ${input.to}`,
      InitiativeId: toInitiativeIdText(input.initiativeId),
      FromStatus: input.from,
      ToStatus: input.to,
      ChangedBy: input.changedBy,
      Comment: input.comment,
      ChangedAtIso: new Date().toISOString(),
    })
  },
}
