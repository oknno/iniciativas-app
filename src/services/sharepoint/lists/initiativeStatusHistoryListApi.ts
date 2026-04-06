import { post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Initiative_Status_History'

interface StatusHistoryListItem {
  readonly Id: number
}

export interface CreateStatusHistoryPayload {
  readonly Title: string
  readonly InitiativeId: string
  readonly FromStatus: string
  readonly ToStatus: string
  readonly ChangedBy: string
  readonly Comment?: string
  readonly TargetRole?: string
  readonly ChangedAtIso: string
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
