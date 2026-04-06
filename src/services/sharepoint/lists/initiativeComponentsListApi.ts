import { deleteItem, get, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { assertListFieldType } from '../listSchema'
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
  readonly ComponentTypeId?: number
  readonly KPICode?: string | SharePointLookupValue
  readonly KPICodeId?: number
  readonly ConversionCode?: string | SharePointLookupValue
  readonly ConversionCodeId?: number
  readonly FormulaCode?: string | SharePointLookupValue
  readonly FormulaCodeId?: number
  readonly Title?: string
  readonly ComponentId?: string
  readonly Direction?: number
  readonly CalculationType?: string
  readonly SortOrder?: number
}

export interface CreateInitiativeComponentPayload {
  readonly InitiativeIdId: number
  readonly ComponentTypeId: number
  readonly KPICodeId?: number
  readonly ConversionCodeId?: number
  readonly FormulaCodeId?: number
  readonly Title?: string
  readonly ComponentId?: string
  readonly Direction?: number
  readonly CalculationType?: string
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
    assertListFieldType(LIST_TITLE, 'KPICode', 'Lookup'),
    assertListFieldType(LIST_TITLE, 'ConversionCode', 'Lookup'),
    assertListFieldType(LIST_TITLE, 'FormulaCode', 'Lookup'),
    assertListFieldType(LIST_TITLE, 'CalculationType', 'Text'),
    assertListFieldType(LIST_TITLE, 'Direction', 'Number'),
  ])
}

export const listByInitiativeId = async (initiativeId: number): Promise<readonly InitiativeComponentListItem[]> => {
  try {
    await validateSchema()

    const response = await get<SharePointListResponse<InitiativeComponentListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}`, {
        select:
          'Id,Title,ComponentId,Direction,CalculationType,SortOrder,InitiativeIdId,InitiativeId/Id,ComponentTypeId,ComponentType/Id,ComponentType/Title,ComponentType/ComponentType,ComponentType/ComponentId,KPICodeId,KPICode/Id,KPICode/Title,KPICode/KPICode,ConversionCodeId,ConversionCode/Id,ConversionCode/Title,ConversionCode/ConversionCode,FormulaCodeId,FormulaCode/Id,FormulaCode/Title,FormulaCode/FormulaCode',
        expand: 'InitiativeId,ComponentType,KPICode,ConversionCode,FormulaCode',
        orderBy: 'SortOrder asc,Id asc',
      }),
    )

    return response.value
  } catch (error) {
    throw new Error(
      `Failed to list initiative components for initiative ${initiativeId} from '${LIST_TITLE}'. ${(error as Error).message}`,
    )
  }
}

export const createManyForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateInitiativeComponentPayload, 'InitiativeIdId'>[],
): Promise<readonly InitiativeComponentListItem[]> => {
  try {
    await validateSchema()

    const created = await Promise.all(
      items.map((item) =>
        post<InitiativeComponentListItem, CreateInitiativeComponentPayload | (CreateInitiativeComponentPayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeIdId: initiativeId,
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
