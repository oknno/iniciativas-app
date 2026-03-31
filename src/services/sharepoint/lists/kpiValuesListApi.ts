import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'KPI_Values'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface KpiValueListItem {
  readonly Id: number
  readonly InitiativeId: number | string
  readonly KPICode: string
  readonly Year: number
  readonly Month: number
  readonly Value: number
  readonly Scenario?: string
}

export interface CreateKpiValuePayload {
  readonly InitiativeId: number
  readonly KPICode: string
  readonly Year: number
  readonly Month: number
  readonly Value: number
  readonly Scenario?: string
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

export const listByInitiativeId = async (initiativeId: number): Promise<readonly KpiValueListItem[]> => {
  try {
    const response = await get<SharePointListResponse<KpiValueListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq ${initiativeId}`),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list KPI values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const createManyForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateKpiValuePayload, 'InitiativeId'>[],
): Promise<readonly KpiValueListItem[]> => {
  try {
    return await Promise.all(
      items.map((item) =>
        post<KpiValueListItem, CreateKpiValuePayload | (CreateKpiValuePayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeId: initiativeId,
          }),
        ),
      ),
    )
  } catch (error) {
    throw new Error(`Failed to create KPI values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const deleteByInitiativeId = async (initiativeId: number): Promise<void> => {
  try {
    const currentItems = await listByInitiativeId(initiativeId)
    await Promise.all(currentItems.map((item) => deleteItem(listItemByIdEndpoint(LIST_TITLE, item.Id))))
  } catch (error) {
    throw new Error(`Failed to delete KPI values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}
