import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Initiative_Component'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

interface SharePointLookupValue {
  readonly Id?: number
  readonly Title?: string
  readonly ComponentType?: string
  readonly ComponentId?: string
  readonly KPICode?: string
  readonly ConversionCode?: string
  readonly FormulaCode?: string
}

export interface InitiativeComponentListItem {
  readonly Id: number
  readonly InitiativeId?: number | string | SharePointLookupValue
  readonly InitiativeIdId?: number
  readonly ComponentType?: string | SharePointLookupValue
  readonly KPICode?: string | SharePointLookupValue
  readonly ConversionCode?: string | SharePointLookupValue
  readonly FormulaCode?: string | SharePointLookupValue
  readonly Title?: string
  readonly ComponentId?: string
  readonly SortOrder?: number
}

export interface CreateInitiativeComponentPayload {
  readonly InitiativeId: number
  readonly ComponentType: string
  readonly KPICode?: string
  readonly ConversionCode?: string
  readonly FormulaCode?: string
  readonly Title?: string
  readonly ComponentId?: string
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

const listByInitiativeIdWithLookup = async (initiativeId: number): Promise<readonly InitiativeComponentListItem[]> => {
  const response = await get<SharePointListResponse<InitiativeComponentListItem>>(
    filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}`, {
      select:
        'Id,Title,ComponentId,SortOrder,InitiativeIdId,InitiativeId/Id,ComponentType,ComponentType/Title,ComponentType/ComponentType,ComponentType/ComponentId,KPICode,KPICode/Title,KPICode/KPICode,ConversionCode,ConversionCode/Title,ConversionCode/ConversionCode,FormulaCode,FormulaCode/Title,FormulaCode/FormulaCode',
      expand: 'InitiativeId,ComponentType,KPICode,ConversionCode,FormulaCode',
      orderBy: 'SortOrder asc,Id asc',
    }),
  )

  return response.value
}

export const listByInitiativeId = async (initiativeId: number): Promise<readonly InitiativeComponentListItem[]> => {
  try {
    return await listByInitiativeIdWithLookup(initiativeId)
  } catch {
    try {
      const response = await get<SharePointListResponse<InitiativeComponentListItem>>(
        filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq ${initiativeId}`, { orderBy: 'Id asc' }),
      )

      return response.value
    } catch (error) {
      throw new Error(
        `Failed to list initiative components for initiative ${initiativeId} from '${LIST_TITLE}'. ${(error as Error).message}`,
      )
    }
  }
}

export const createManyForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateInitiativeComponentPayload, 'InitiativeId'>[],
): Promise<readonly InitiativeComponentListItem[]> => {
  try {
    const created = await Promise.all(
      items.map((item) =>
        post<InitiativeComponentListItem, CreateInitiativeComponentPayload | (CreateInitiativeComponentPayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeId: initiativeId,
          }),
        ),
      ),
    )

    return created
  } catch (error) {
    throw new Error(
      `Failed to create initiative components for initiative ${initiativeId} in '${LIST_TITLE}'. ${(error as Error).message}`,
    )
  }
}

export const deleteByInitiativeId = async (initiativeId: number): Promise<void> => {
  try {
    const currentItems = await listByInitiativeId(initiativeId)
    await Promise.all(currentItems.map((item) => deleteItem(listItemByIdEndpoint(LIST_TITLE, item.Id))))
  } catch (error) {
    throw new Error(
      `Failed to delete initiative components for initiative ${initiativeId} from '${LIST_TITLE}'. ${(error as Error).message}`,
    )
  }
}
