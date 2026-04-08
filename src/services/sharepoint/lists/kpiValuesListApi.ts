import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { assertListFieldType } from '../listSchema'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'KPI_Values'

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

interface SharePointLookupValue {
  readonly Id?: number
  readonly Title?: string
  readonly KPICode?: string
  readonly ComponentId?: string
  readonly ComponentType?: string
}

export interface KpiValueListItem {
  readonly Id: number
  readonly Title?: string
  readonly InitiativeId?: number | string | SharePointLookupValue
  readonly InitiativeIdId?: number
  readonly KPICode: string | SharePointLookupValue
  readonly KPICodeId?: number
  readonly ComponentType?: string | SharePointLookupValue
  readonly ComponentTypeId?: number
  readonly Year: number
  readonly Month: number
  readonly Value: number
  readonly Scenario?: string
}

export interface CreateKpiValuePayload {
  readonly InitiativeIdId: number
  readonly Title: string
  readonly KPICodeId: number
  readonly ComponentTypeId?: number
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

const validateSchema = async (): Promise<void> => {
  await Promise.all([
    assertListFieldType(LIST_TITLE, 'InitiativeId', 'Lookup'),
    assertListFieldType(LIST_TITLE, 'KPICode', 'Lookup'),
    assertListFieldType(LIST_TITLE, 'ComponentType', 'Lookup'),
  ])
}

export const listByInitiativeId = async (
  initiativeId: number,
  filters?: {
    readonly year?: number
    readonly scenario?: string
  },
): Promise<readonly KpiValueListItem[]> => {
  try {
    await validateSchema()
    const yearFilter = Number.isInteger(filters?.year) ? ` and Year eq ${filters?.year}` : ''
    const scenarioFilter = filters?.scenario ? ` and Scenario eq '${filters.scenario}'` : ''

    const response = await get<SharePointListResponse<KpiValueListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}${yearFilter}${scenarioFilter}`, {
        select:
          'Id,Title,InitiativeIdId,InitiativeId/Id,KPICodeId,KPICode/Id,KPICode/Title,KPICode/KPICode,ComponentTypeId,ComponentType/Id,ComponentType/ComponentId,ComponentType/ComponentType,Year,Month,Value,Scenario',
        expand: 'InitiativeId,KPICode,ComponentType',
        orderBy: 'Year asc,Month asc',
      }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list KPI values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const createManyForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateKpiValuePayload, 'InitiativeIdId'>[],
): Promise<readonly KpiValueListItem[]> => {
  try {
    await validateSchema()

    return await Promise.all(
      items.map((item) =>
        post<KpiValueListItem, CreateKpiValuePayload | (CreateKpiValuePayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeIdId: initiativeId,
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
