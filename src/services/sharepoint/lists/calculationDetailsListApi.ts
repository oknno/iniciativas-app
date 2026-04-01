import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Calculation_Detail'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface CalculationDetailListItem {
  readonly Id: number
  readonly InitiativeId: number
  readonly ComponentType: string
  readonly Year: number
  readonly Month: number
  readonly FormulaCode: string
  readonly Direction: number
  readonly RawValue: number
  readonly SignedValue: number
  readonly BaseValue?: number
  readonly ConversionValue?: number
  readonly ResultValue?: number
  readonly KpiCode?: string
  readonly ConversionCode?: string
  readonly SourceType: string
  readonly Explanation: string
}

export interface CreateCalculationDetailPayload {
  readonly InitiativeId: number
  readonly ComponentType: string
  readonly Year: number
  readonly Month: number
  readonly FormulaCode: string
  readonly Direction: number
  readonly RawValue: number
  readonly SignedValue: number
  readonly BaseValue?: number
  readonly ConversionValue?: number
  readonly ResultValue?: number
  readonly KpiCode?: string
  readonly ConversionCode?: string
  readonly SourceType: string
  readonly Explanation: string
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

export const listByInitiativeId = async (initiativeId: number): Promise<readonly CalculationDetailListItem[]> => {
  try {
    const response = await get<SharePointListResponse<CalculationDetailListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeId eq ${initiativeId}`, { orderBy: 'Year asc,Month asc' }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list calculation details for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const replaceForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateCalculationDetailPayload, 'InitiativeId'>[],
): Promise<readonly CalculationDetailListItem[]> => {
  try {
    const existing = await listByInitiativeId(initiativeId)
    await Promise.all(existing.map((item) => deleteItem(listItemByIdEndpoint(LIST_TITLE, item.Id))))

    return await Promise.all(
      items.map((item) =>
        post<CalculationDetailListItem, CreateCalculationDetailPayload | (CreateCalculationDetailPayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeId: initiativeId,
          }),
        ),
      ),
    )
  } catch (error) {
    throw new Error(`Failed to replace calculation details for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}
