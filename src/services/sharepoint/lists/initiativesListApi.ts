import { deleteItem, get, merge, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { listEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Initiatives'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
  readonly '@odata.nextLink'?: string
}

export interface InitiativeListItem {
  readonly Id: number
  readonly Title: string
  readonly Unidade: string
  readonly Responsavel: string
  readonly Stage: string
  readonly Status: string
  readonly Created?: string
  readonly Modified?: string
}

export interface CreateInitiativePayload {
  readonly Title: string
  readonly Unidade: string
  readonly Responsavel: string
  readonly Stage: string
  readonly Status: string
}

export type UpdateInitiativePayload = Partial<CreateInitiativePayload>
export interface ListInitiativesPageOptions {
  readonly top?: number
  readonly pageToken?: string
}

export interface ListInitiativesPageResult {
  readonly items: readonly InitiativeListItem[]
  readonly nextPageToken?: string
  readonly totalCount: number
}

const select = 'Id,Title,Unidade,Responsavel,Stage,Status,Created,Modified'

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

const extractSkipTokenFromNextLink = (nextLink?: string): string | undefined => {
  if (!nextLink) {
    return undefined
  }

  try {
    const url = new URL(nextLink, 'https://dummy.local')
    return url.searchParams.get('$skiptoken') ?? undefined
  } catch {
    return undefined
  }
}

const getInitiativesTotalCount = async (): Promise<number> => {
  const endpoint = `${listEndpoint(LIST_TITLE)}?$select=ItemCount`
  const payload = await get<{ readonly ItemCount?: number }>(endpoint)
  return payload.ItemCount ?? 0
}

export const listInitiatives = async (options?: ListInitiativesPageOptions): Promise<ListInitiativesPageResult> => {
  try {
    const [response, totalCount] = await Promise.all([
      get<SharePointListResponse<InitiativeListItem>>(
        listItemsEndpoint(LIST_TITLE, {
          select,
          top: options?.top,
          skipToken: options?.pageToken,
        }),
      ),
      getInitiativesTotalCount(),
    ])

    return {
      items: response.value,
      nextPageToken: extractSkipTokenFromNextLink(response['@odata.nextLink']),
      totalCount,
    }
  } catch (error) {
    throw new Error(`Failed to list initiatives from '${LIST_TITLE}'. ${(error as Error).message}`)
  }
}

export const getInitiativeById = async (id: number): Promise<InitiativeListItem> => {
  try {
    return await get<InitiativeListItem>(listItemByIdEndpoint(LIST_TITLE, id))
  } catch (error) {
    throw new Error(`Failed to get initiative ${id} from '${LIST_TITLE}'. ${(error as Error).message}`)
  }
}

export const createInitiative = async (payload: CreateInitiativePayload): Promise<InitiativeListItem> => {
  try {
    return await post<InitiativeListItem, CreateInitiativePayload | (CreateInitiativePayload & { __metadata: { type: string } })>(
      listItemsEndpoint(LIST_TITLE),
      withEntityType(payload),
    )
  } catch (error) {
    throw new Error(`Failed to create initiative in '${LIST_TITLE}'. ${(error as Error).message}`)
  }
}

export const updateInitiative = async (id: number, payload: UpdateInitiativePayload): Promise<InitiativeListItem> => {
  try {
    await merge<InitiativeListItem, UpdateInitiativePayload | (UpdateInitiativePayload & { __metadata: { type: string } })>(
      listItemByIdEndpoint(LIST_TITLE, id),
      withEntityType(payload),
    )

    return await getInitiativeById(id)
  } catch (error) {
    throw new Error(`Failed to update initiative ${id} in '${LIST_TITLE}'. ${(error as Error).message}`)
  }
}

export const deleteInitiative = async (id: number): Promise<void> => {
  try {
    await deleteItem(listItemByIdEndpoint(LIST_TITLE, id))
  } catch (error) {
    throw new Error(`Failed to delete initiative ${id} from '${LIST_TITLE}'. ${(error as Error).message}`)
  }
}
