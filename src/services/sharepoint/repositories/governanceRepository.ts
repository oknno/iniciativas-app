import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { createAuditLog, listAuditLogsByInitiativeId } from '../lists/auditLogListApi'
import { createStatusHistory, listStatusHistoryByInitiativeId } from '../lists/initiativeStatusHistoryListApi'

const toInitiativeIdText = (initiativeId?: InitiativeId): string => (initiativeId ? String(initiativeId) : 'N/A')
const toUtcNowIso = (): string => new Date().toISOString()

interface AuditFieldDiff {
  readonly fieldName: string
  readonly oldValue?: string
  readonly newValue?: string
}

export const governanceRepository = {
  async logAudit(input: {
    readonly title: string
    readonly initiativeId?: InitiativeId
    readonly entityType: string
    readonly entityId: string
    readonly changedBy: string
    readonly changes: readonly AuditFieldDiff[]
  }): Promise<void> {
    const changedAt = toUtcNowIso()

    await Promise.all(
      input.changes.map((change) =>
        createAuditLog({
          Title: input.title,
          InitiativeId: toInitiativeIdText(input.initiativeId),
          EntityType: input.entityType,
          EntityId: input.entityId,
          FieldName: change.fieldName,
          OldValue: change.oldValue,
          NewValue: change.newValue,
          ChangedBy: input.changedBy,
          ChangedAt: changedAt,
        }),
      ),
    )
  },

  async logAccessDenied(input: {
    readonly initiativeId?: InitiativeId
    readonly changedBy: string
    readonly action: string
    readonly role: string
    readonly reason: string
  }): Promise<void> {
    await this.logAudit({
      title: 'ACCESS_DENIED',
      initiativeId: input.initiativeId,
      entityType: 'AccessControl',
      entityId: toInitiativeIdText(input.initiativeId),
      changedBy: input.changedBy,
      changes: [
        { fieldName: 'Action', newValue: input.action },
        { fieldName: 'Role', newValue: input.role },
        { fieldName: 'Reason', newValue: input.reason },
      ],
    })
  },

  async addStatusHistory(input: {
    readonly initiativeId: InitiativeId
    readonly from: string
    readonly to: string
    readonly initiativeStatus: string
    readonly changedBy: string
    readonly comment?: string
    readonly targetRole?: string
  }): Promise<void> {
    const changedAt = toUtcNowIso()
    await createStatusHistory({
      Title: `${input.from} -> ${input.to}`,
      InitiativeId: toInitiativeIdText(input.initiativeId),
      Initiative_Status: input.initiativeStatus,
      FromStatus: input.from,
      ToStatus: input.to,
      ChangedBy: input.changedBy,
      Comment: input.comment,
      TargetRole: input.targetRole,
      ChangedAt: changedAt,
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
