import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Calculation_Result'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface CalculationResultListItem {
  readonly Id: number
  readonly InitiativeId: number | { readonly Id?: number }
  readonly InitiativeIdId?: number
  readonly Year: number
  readonly Month: number
  readonly GainValue: number
  readonly AccumulatedValue?: number
  readonly AnnualValue?: number
}

export interface CreateCalculationResultPayload {
  readonly InitiativeId: number
  readonly Year: number
  readonly Month: number
  readonly GainValue: number
  readonly AccumulatedValue?: number
  readonly AnnualValue?: number
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

export const listByInitiativeId = async (initiativeId: number): Promise<readonly CalculationResultListItem[]> => {
  try {
    const response = await get<SharePointListResponse<CalculationResultListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}`, {
        select: 'Id,InitiativeId,InitiativeIdId,Year,Month,GainValue,AccumulatedValue,AnnualValue',
        orderBy: 'Year asc,Month asc',
      }),
    )

    return response.value
  } catch {
    try {
      const response = await get<SharePointListResponse<CalculationResultListItem>>(
        filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq ${initiativeId}`, { orderBy: 'Year asc,Month asc' }),
      )

      return response.value
    } catch (error) {
      throw new Error(`Failed to list calculation results for initiative ${initiativeId}. ${(error as Error).message}`)
    }
  }
}

export const replaceForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateCalculationResultPayload, 'InitiativeId'>[],
): Promise<readonly CalculationResultListItem[]> => {
  try {
    const existing = await listByInitiativeId(initiativeId)
    await Promise.all(existing.map((item) => deleteItem(listItemByIdEndpoint(LIST_TITLE, item.Id))))

    return await Promise.all(
      items.map((item) =>
        post<CalculationResultListItem, CreateCalculationResultPayload | (CreateCalculationResultPayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeId: initiativeId,
          }),
        ),
      ),
    )
  } catch (error) {
    throw new Error(`Failed to replace calculation results for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}
