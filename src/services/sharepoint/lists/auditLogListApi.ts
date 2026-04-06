import { get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Audit_Log'

interface AuditLogListItem {
  readonly Id: number
}

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface CreateAuditLogPayload {
  readonly Title: string
  readonly EntityType: string
  readonly EntityId: string
  readonly FieldName: string
  readonly OldValue?: string
  readonly NewValue?: string
  readonly ChangedBy: string
  readonly ChangedAt: string
  readonly InitiativeId?: string
  readonly InitiativeIdId?: number
}

interface LegacyAuditLogEntry {
  readonly Id: number
  readonly Title: string
  readonly InitiativeId?: number
  readonly EventType?: string
  readonly ChangedBy: string
  readonly PayloadJson?: string
  readonly Created?: string
}

export interface AuditLogEntry {
  readonly Id: number
  readonly Title: string
  readonly InitiativeId?: number
  readonly EntityType: string
  readonly EntityId: string
  readonly FieldName: string
  readonly OldValue?: string
  readonly NewValue?: string
  readonly ChangedBy: string
  readonly ChangedAt?: string
  readonly Created?: string
}

const withEntityType = <TPayload extends object>(payload: TPayload): TPayload | (TPayload & { __metadata: { type: string } }) => {
  const entityType = sharePointContext.listItemEntityTypeNames[LIST_TITLE]

  if (!entityType) {
    return payload
  }

  return {
    ...payload,
    __metadata: { type: entityType },
  }
}

export const createAuditLog = async (payload: CreateAuditLogPayload): Promise<void> => {
  await post<AuditLogListItem, CreateAuditLogPayload | (CreateAuditLogPayload & { __metadata: { type: string } })>(
    listItemsEndpoint(LIST_TITLE),
    withEntityType(payload),
  )
}

const mapLegacyEntry = (legacy: LegacyAuditLogEntry): AuditLogEntry => {
  let parsedPayload: Record<string, unknown> | undefined

  if (legacy.PayloadJson) {
    try {
      parsedPayload = JSON.parse(legacy.PayloadJson) as Record<string, unknown>
    } catch {
      parsedPayload = undefined
    }
  }

  const payloadKeys = parsedPayload ? Object.keys(parsedPayload) : []
  const legacyField = payloadKeys[0]

  return {
    Id: legacy.Id,
    Title: legacy.Title || legacy.EventType || 'LEGACY_AUDIT',
    InitiativeId: legacy.InitiativeId,
    EntityType: 'LegacyAuditEvent',
    EntityId: String(legacy.InitiativeId ?? ''),
    FieldName: legacyField ?? 'LegacyPayload',
    OldValue: undefined,
    NewValue: legacyField ? String(parsedPayload?.[legacyField] ?? '') : legacy.PayloadJson,
    ChangedBy: legacy.ChangedBy,
    ChangedAt: legacy.Created,
    Created: legacy.Created,
  }
}

const isDiffEntry = (entry: AuditLogEntry | LegacyAuditLogEntry): entry is AuditLogEntry => {
  return 'EntityType' in entry && 'EntityId' in entry && 'FieldName' in entry
}

const listByInitiativeIdWithLookup = async (initiativeId: number): Promise<readonly AuditLogEntry[]> => {
  const response = await get<SharePointListResponse<AuditLogEntry | LegacyAuditLogEntry>>(
    filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}`, {
      select: 'Id,Title,InitiativeIdId,EntityType,EntityId,FieldName,OldValue,NewValue,ChangedBy,ChangedAt,Created,EventType,PayloadJson',
      orderBy: 'Created desc',
    }),
  )

  return response.value.map((item) => (isDiffEntry(item) ? item : mapLegacyEntry(item)))
}

export const listAuditLogsByInitiativeId = async (initiativeId: number): Promise<readonly AuditLogEntry[]> => {
  try {
    return await listByInitiativeIdWithLookup(initiativeId)
  } catch {
    const response = await get<SharePointListResponse<AuditLogEntry | LegacyAuditLogEntry>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq '${initiativeId}'`, {
        select: 'Id,Title,InitiativeId,EntityType,EntityId,FieldName,OldValue,NewValue,ChangedBy,ChangedAt,Created,EventType,PayloadJson',
        orderBy: 'Created desc',
      }),
    )

    return response.value.map((item) => (isDiffEntry(item) ? item : mapLegacyEntry(item)))
  }
}
