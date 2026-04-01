import { post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Audit_Log'

interface AuditLogListItem {
  readonly Id: number
}

export interface CreateAuditLogPayload {
  readonly Title: string
  readonly InitiativeId: string
  readonly EventType: string
  readonly ChangedBy: string
  readonly PayloadJson?: string
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
