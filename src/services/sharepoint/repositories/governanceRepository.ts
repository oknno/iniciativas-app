import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { CreateAuditLogPayload } from '../lists/auditLogListApi'
import { createAuditLog } from '../lists/auditLogListApi'
import { createStatusHistory } from '../lists/initiativeStatusHistoryListApi'

const toInitiativeIdText = (initiativeId?: InitiativeId): string => (initiativeId ? String(initiativeId) : 'N/A')
const toUtcNowIso = (): string => new Date().toISOString()
const toCompactTimestamp = (isoDate: string): string => isoDate.replace(/\D/g, '')

const resolveInitiativeIdForAuditPayload = (initiativeId?: InitiativeId): Pick<CreateAuditLogPayload, 'InitiativeId' | 'InitiativeIdId'> => {
  if (!initiativeId) {
    return { InitiativeId: 'N/A' }
  }

  const rawInitiativeId = String(initiativeId)
  const parsedInitiativeId = Number(rawInitiativeId)

  if (Number.isFinite(parsedInitiativeId)) {
    return { InitiativeIdId: parsedInitiativeId }
  }

  return { InitiativeId: rawInitiativeId }
}

const resolveAuditTitle = (inputTitle: string, entityType: string, entityId: string, changedAt: string): string => {
  if (inputTitle.trim()) {
    return inputTitle
  }

  return `AUDIT-${entityType}-${entityId}-${toCompactTimestamp(changedAt)}`
}

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
    const title = resolveAuditTitle(input.title, input.entityType, input.entityId, changedAt)
    const initiativeIdPayload = resolveInitiativeIdForAuditPayload(input.initiativeId)

    await Promise.all(
      input.changes.map((change) =>
        createAuditLog({
          Title: title,
          EntityType: input.entityType,
          EntityId: input.entityId,
          FieldName: change.fieldName,
          OldValue: change.oldValue,
          NewValue: change.newValue,
          ChangedBy: input.changedBy,
          ChangedAt: changedAt,
          ...initiativeIdPayload,
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

  async logConversionValuesChanged(input: {
    readonly initiativeId: InitiativeId
    readonly changedBy: string
    readonly rowsAffected: number
    readonly year: number
    readonly scenario: string
  }): Promise<void> {
    await this.logAudit({
      title: 'CONVERSION_VALUES_UPDATED',
      initiativeId: input.initiativeId,
      entityType: 'ConversionValues',
      entityId: String(input.initiativeId),
      changedBy: input.changedBy,
      changes: [
        { fieldName: 'RowsAffected', newValue: String(input.rowsAffected) },
        { fieldName: 'Year', newValue: String(input.year) },
        { fieldName: 'Scenario', newValue: input.scenario },
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

}
