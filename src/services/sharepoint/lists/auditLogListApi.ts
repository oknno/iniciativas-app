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
  readonly InitiativeId: string
  readonly EventType: string
  readonly ChangedBy: string
  readonly PayloadJson?: string
}

export interface AuditLogEntry {
  readonly Id: number
  readonly Title: string
  readonly InitiativeId?: number
  readonly EventType: string
  readonly ChangedBy: string
  readonly PayloadJson?: string
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

const listByInitiativeIdWithLookup = async (initiativeId: number): Promise<readonly AuditLogEntry[]> => {
  const response = await get<SharePointListResponse<AuditLogEntry>>(
    filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}`, {
      select: 'Id,Title,InitiativeIdId,EventType,ChangedBy,PayloadJson,Created',
      orderBy: 'Created desc',
    }),
  )

  return response.value
}

export const listAuditLogsByInitiativeId = async (initiativeId: number): Promise<readonly AuditLogEntry[]> => {
  try {
    return await listByInitiativeIdWithLookup(initiativeId)
  } catch {
    const response = await get<SharePointListResponse<AuditLogEntry>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq '${initiativeId}'`, {
        select: 'Id,Title,InitiativeId,EventType,ChangedBy,PayloadJson,Created',
        orderBy: 'Created desc',
      }),
    )

    return response.value
  }
}
