import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { assertListFieldType } from '../listSchema'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Component_Values'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

interface SharePointLookupValue {
  readonly Id?: number
  readonly Title?: string
  readonly ComponentId?: string
  readonly ComponentType?: string
}

export interface ComponentValueListItem {
  readonly Id: number
  readonly Title?: string
  readonly InitiativeId?: number | string | SharePointLookupValue
  readonly InitiativeIdId?: number
  readonly ComponentType: string | SharePointLookupValue
  readonly ComponentTypeId?: number
  readonly Year: number
  readonly Month: number
  readonly Value: number
}

export interface CreateComponentValuePayload {
  readonly InitiativeIdId: number
  readonly Title: string
  readonly ComponentTypeId: number
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

const validateSchema = async (): Promise<void> => {
  await Promise.all([
    assertListFieldType(LIST_TITLE, 'InitiativeId', 'Lookup'),
    assertListFieldType(LIST_TITLE, 'ComponentType', 'Lookup'),
  ])
}

export const listByInitiativeId = async (initiativeId: number): Promise<readonly ComponentValueListItem[]> => {
  try {
    await validateSchema()

    const response = await get<SharePointListResponse<ComponentValueListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}`, {
        select:
          'Id,Title,InitiativeIdId,InitiativeId/Id,ComponentTypeId,ComponentType/Id,ComponentType/Title,ComponentType/ComponentId,ComponentType/ComponentType,Year,Month,Value',
        expand: 'InitiativeId,ComponentType',
        orderBy: 'Year asc,Month asc',
      }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list component values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const createManyForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateComponentValuePayload, 'InitiativeIdId'>[],
): Promise<readonly ComponentValueListItem[]> => {
  try {
    await validateSchema()

    return await Promise.all(
      items.map((item) =>
        post<ComponentValueListItem, CreateComponentValuePayload | (CreateComponentValuePayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeIdId: initiativeId,
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
