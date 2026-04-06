import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { createAuditLog, listAuditLogsByInitiativeId } from '../lists/auditLogListApi'
import { createStatusHistory, listStatusHistoryByInitiativeId } from '../lists/initiativeStatusHistoryListApi'

const toInitiativeIdText = (initiativeId?: InitiativeId): string => (initiativeId ? String(initiativeId) : 'N/A')
const toUtcNowIso = (): string => new Date().toISOString()

export const governanceRepository = {
  async logAudit(input: {
    readonly initiativeId?: InitiativeId
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

  async logAccessDenied(input: {
    readonly initiativeId?: InitiativeId
    readonly changedBy: string
    readonly action: string
    readonly role: string
    readonly reason: string
  }): Promise<void> {
    await this.logAudit({
      initiativeId: input.initiativeId,
      eventType: 'ACCESS_DENIED',
      changedBy: input.changedBy,
      payload: {
        action: input.action,
        role: input.role,
        reason: input.reason,
      },
    })
  },

  async addStatusHistory(input: {
    readonly initiativeId: InitiativeId
    readonly from: string
    readonly to: string
    readonly changedBy: string
    readonly comment?: string
    readonly targetRole?: string
  }): Promise<void> {
    const changedAt = toUtcNowIso()
    await createStatusHistory({
      Title: `${input.from} -> ${input.to}`,
      InitiativeId: toInitiativeIdText(input.initiativeId),
      FromStatus: input.from,
      ToStatus: input.to,
      ChangedBy: input.changedBy,
      Comment: input.comment,
      TargetRole: input.targetRole,
      ChangedAt: changedAt,
      ChangedAtIso: changedAt,
    })
  },

  async getOperationalAuditByInitiative(initiativeId: InitiativeId): Promise<{
    readonly auditLog: Awaited<ReturnType<typeof listAuditLogsByInitiativeId>>
    readonly statusHistory: Awaited<ReturnType<typeof listStatusHistoryByInitiativeId>>
  }> {
    const numericInitiativeId = Number(initiativeId)
    if (!Number.isFinite(numericInitiativeId)) {
      throw new Error(`Initiative id inválido para auditoria operacional: ${initiativeId}`)
    }

    const [auditLog, statusHistory] = await Promise.all([
      listAuditLogsByInitiativeId(numericInitiativeId),
      listStatusHistoryByInitiativeId(numericInitiativeId),
    ])

    return {
      auditLog,
      statusHistory,
    }
  },
}
