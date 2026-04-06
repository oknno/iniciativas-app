import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { OperationalAuditDto } from '../../dto/governance/OperationalAuditDto'
import { governanceRepository } from '../../../services/sharepoint/repositories/governanceRepository'

const toChangedAt = (changedAt?: string, created?: string): string => changedAt ?? created ?? ''

export const getOperationalAuditByInitiative = async (initiativeId: InitiativeId): Promise<OperationalAuditDto> => {
  const result = await governanceRepository.getOperationalAuditByInitiative(initiativeId)

  return {
    auditLog: result.auditLog.map((item) => ({
      id: item.Id,
      entityType: item.EntityType,
      entityId: item.EntityId,
      fieldName: item.FieldName,
      oldValue: item.OldValue,
      newValue: item.NewValue,
      changedBy: item.ChangedBy,
      changedAt: toChangedAt(item.ChangedAt, item.Created),
      title: item.Title,
    })),
    statusHistory: result.statusHistory.map((item) => ({
      id: item.Id,
      fromStatus: item.FromStatus,
      toStatus: item.ToStatus,
      changedBy: item.ChangedBy,
      changedAt: toChangedAt(item.ChangedAt, item.Created),
      comment: item.Comment,
      targetRole: item.TargetRole,
      title: item.Title,
    })),
  }
}
