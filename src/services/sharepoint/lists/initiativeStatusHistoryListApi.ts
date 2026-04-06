import { get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Initiative_Status_History'

interface StatusHistoryListItem {
  readonly Id: number
}

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface CreateStatusHistoryPayload {
  readonly Title: string
  readonly InitiativeId: string
  readonly FromStatus: string
  readonly ToStatus: string
  readonly ChangedBy: string
  readonly Comment?: string
  readonly TargetRole?: string
  readonly ChangedAt: string
  readonly ChangedAtIso: string
}

export interface StatusHistoryEntry {
  readonly Id: number
  readonly Title: string
  readonly InitiativeId?: number
  readonly FromStatus: string
  readonly ToStatus: string
  readonly ChangedBy: string
  readonly Comment?: string
  readonly TargetRole?: string
  readonly ChangedAt?: string
  readonly ChangedAtIso?: string
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

export const createStatusHistory = async (payload: CreateStatusHistoryPayload): Promise<void> => {
  await post<StatusHistoryListItem, CreateStatusHistoryPayload | (CreateStatusHistoryPayload & { __metadata: { type: string } })>(
    listItemsEndpoint(LIST_TITLE),
    withEntityType(payload),
  )
}

const listByInitiativeIdWithLookup = async (initiativeId: number): Promise<readonly StatusHistoryEntry[]> => {
  const response = await get<SharePointListResponse<StatusHistoryEntry>>(
    filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}`, {
      select: 'Id,Title,InitiativeIdId,FromStatus,ToStatus,ChangedBy,Comment,TargetRole,ChangedAt,ChangedAtIso,Created',
      orderBy: 'Created desc',
    }),
  )

  return response.value
}

export const listStatusHistoryByInitiativeId = async (initiativeId: number): Promise<readonly StatusHistoryEntry[]> => {
  try {
    return await listByInitiativeIdWithLookup(initiativeId)
  } catch {
    const response = await get<SharePointListResponse<StatusHistoryEntry>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq '${initiativeId}'`, {
        select: 'Id,Title,InitiativeId,FromStatus,ToStatus,ChangedBy,Comment,TargetRole,ChangedAt,ChangedAtIso,Created',
        orderBy: 'Created desc',
      }),
    )

    return response.value
  }
}
