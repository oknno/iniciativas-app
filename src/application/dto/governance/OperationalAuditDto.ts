export interface OperationalAuditLogEntryDto {
  readonly id: number
  readonly eventType: string
  readonly changedBy: string
  readonly changedAt: string
  readonly payloadJson?: string
  readonly title: string
}

export interface OperationalStatusHistoryEntryDto {
  readonly id: number
  readonly fromStatus: string
  readonly toStatus: string
  readonly changedBy: string
  readonly changedAt: string
  readonly comment?: string
  readonly targetRole?: string
  readonly title: string
}

export interface OperationalAuditDto {
  readonly auditLog: readonly OperationalAuditLogEntryDto[]
  readonly statusHistory: readonly OperationalStatusHistoryEntryDto[]
}
