import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Component_Values'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface ComponentValueListItem {
  readonly Id: number
  readonly InitiativeId: number | string
  readonly ComponentType: string
  readonly Year: number
  readonly Month: number
  readonly Value: number
}

export interface CreateComponentValuePayload {
  readonly InitiativeId: number
  readonly ComponentType: string
  readonly Year: number
  readonly Month: number
  readonly Value: number
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

export const listByInitiativeId = async (initiativeId: number): Promise<readonly ComponentValueListItem[]> => {
  try {
    const response = await get<SharePointListResponse<ComponentValueListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq ${initiativeId}`),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list component values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const createManyForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateComponentValuePayload, 'InitiativeId'>[],
): Promise<readonly ComponentValueListItem[]> => {
  try {
    return await Promise.all(
      items.map((item) =>
        post<ComponentValueListItem, CreateComponentValuePayload | (CreateComponentValuePayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeId: initiativeId,
          }),
        ),
      ),
    )
  } catch (error) {
    throw new Error(`Failed to create component values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const deleteByInitiativeId = async (initiativeId: number): Promise<void> => {
  try {
    const currentItems = await listByInitiativeId(initiativeId)
    await Promise.all(currentItems.map((item) => deleteItem(listItemByIdEndpoint(LIST_TITLE, item.Id))))
  } catch (error) {
    throw new Error(`Failed to delete component values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}
