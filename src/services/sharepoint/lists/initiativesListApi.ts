import { deleteItem, get, merge, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Initiatives'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface InitiativeListItem {
  readonly Id: number
  readonly Title: string
  readonly Code: string
  readonly Description?: string
  readonly Owner: string
  readonly Stage: string
  readonly Status: string
  readonly Scenario: string
  readonly ImplementationCost: number
  readonly StartMonthRef: string
  readonly EndMonthRef: string
  readonly Created?: string
  readonly Modified?: string
}

export interface CreateInitiativePayload {
  readonly Title: string
  readonly Code: string
  readonly Description?: string
  readonly Owner: string
  readonly Stage: string
  readonly Status: string
  readonly Scenario: string
  readonly ImplementationCost: number
  readonly StartMonthRef: string
  readonly EndMonthRef: string
}

export type UpdateInitiativePayload = Partial<CreateInitiativePayload>

const select =
  'Id,Title,Code,Description,Owner,Stage,Status,Scenario,ImplementationCost,StartMonthRef,EndMonthRef,Created,Modified'

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

export const listInitiatives = async (): Promise<readonly InitiativeListItem[]> => {
  try {
    const response = await get<SharePointListResponse<InitiativeListItem>>(listItemsEndpoint(LIST_TITLE, { select }))
    return response.value
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
