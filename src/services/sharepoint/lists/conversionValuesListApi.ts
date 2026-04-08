import { deleteItem, get, getRequestDigest, post } from '../spHttp'
import { sharePointContext } from '../spContext'
import { assertListFieldType } from '../listSchema'
import { filteredListItemsEndpoint, listItemByIdEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Conversion_Values'
const CONTEXT_SITE_URL = sharePointContext.siteUrl

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

interface SharePointLookupValue {
  readonly Id?: number
  readonly Title?: string
  readonly ConversionCode?: string
}

export interface ConversionValueListItem {
  readonly Id: number
  readonly ConversionCode: string | SharePointLookupValue
  readonly ConversionCodeId?: number
  readonly InitiativeId?: number | string | SharePointLookupValue
  readonly InitiativeIdId?: number
  readonly Year: number
  readonly Month: number
  readonly Value: number
  readonly Scenario?: string
}

export interface CreateConversionValuePayload {
  readonly Title: string
  readonly ConversionCodeId: number
  readonly InitiativeIdId: number
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
    assertListFieldType(LIST_TITLE, 'ConversionCode', 'Lookup'),
    assertListFieldType(LIST_TITLE, 'InitiativeId', 'Lookup'),
  ])
}

export const listAll = async (): Promise<readonly ConversionValueListItem[]> => {
  try {
    await validateSchema()

    const response = await get<SharePointListResponse<ConversionValueListItem>>(
      listItemsEndpoint(LIST_TITLE, {
        select:
          'Id,ConversionCodeId,ConversionCode/Id,ConversionCode/Title,ConversionCode/ConversionCode,InitiativeId,InitiativeIdId,InitiativeId/Id,Year,Month,Value,Scenario',
        expand: 'ConversionCode,InitiativeId',
        orderBy: 'Year asc,Month asc',
      }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list conversion values records from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`)
  }
}

export const getByCode = async (conversionCode: string): Promise<readonly ConversionValueListItem[]> => {
  try {
    await validateSchema()

    const response = await get<SharePointListResponse<ConversionValueListItem>>(
      filteredListItemsEndpoint(
        LIST_TITLE,
        `ConversionCode/ConversionCode eq '${conversionCode.replace(/'/g, "''")}'`,
        {
          select:
            'Id,ConversionCodeId,ConversionCode/Id,ConversionCode/Title,ConversionCode/ConversionCode,InitiativeId,InitiativeIdId,InitiativeId/Id,Year,Month,Value,Scenario',
          expand: 'ConversionCode,InitiativeId',
          orderBy: 'Year asc,Month asc',
        },
      ),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to get conversion values by code '${conversionCode}'. ${(error as Error).message}`)
  }
}

export const listByInitiativeId = async (
  initiativeId: number,
  filters?: {
    readonly year?: number
    readonly scenario?: string
  },
): Promise<readonly ConversionValueListItem[]> => {
  try {
    await validateSchema()
    const yearFilter = Number.isInteger(filters?.year) ? ` and Year eq ${filters?.year}` : ''
    const scenarioFilter = filters?.scenario ? ` and Scenario eq '${filters.scenario.replace(/'/g, "''")}'` : ''

    const response = await get<SharePointListResponse<ConversionValueListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `InitiativeIdId eq ${initiativeId}${yearFilter}${scenarioFilter}`, {
        select:
          'Id,ConversionCodeId,ConversionCode/Id,ConversionCode/Title,ConversionCode/ConversionCode,InitiativeId,InitiativeIdId,InitiativeId/Id,Year,Month,Value,Scenario',
        expand: 'ConversionCode,InitiativeId',
        orderBy: 'Year asc,Month asc',
      }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list conversion values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const createManyForInitiative = async (
  initiativeId: number,
  items: readonly Omit<CreateConversionValuePayload, 'InitiativeIdId'>[],
): Promise<readonly ConversionValueListItem[]> => {
  try {
    await validateSchema()

    return await Promise.all(
      items.map((item) =>
        post<ConversionValueListItem, CreateConversionValuePayload | (CreateConversionValuePayload & { __metadata: { type: string } })>(
          listItemsEndpoint(LIST_TITLE),
          withEntityType({
            ...item,
            InitiativeIdId: initiativeId,
          }),
        ),
      ),
    )
  } catch (error) {
    throw new Error(`Failed to create conversion values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}

export const updateValueById = async (
  id: number,
  patch: Partial<Pick<CreateConversionValuePayload, 'Value' | 'Scenario' | 'Year' | 'Month'>>,
): Promise<void> => {
  const digest = await getRequestDigest()
  const endpoint = listItemByIdEndpoint(LIST_TITLE, id)
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: new Headers({
      Accept: 'application/json;odata=nometadata',
      'Content-Type': 'application/json;odata=nometadata',
      ...sharePointContext.defaultHeaders,
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'IF-MATCH': '*',
    }),
    body: JSON.stringify(withEntityType(patch)),
  })

  if (!response.ok) {
    throw new Error(`Failed to update conversion value ${id}. ${response.status} ${response.statusText}`)
  }
}

export const deleteById = async (id: number): Promise<void> => {
  try {
    await deleteItem(listItemByIdEndpoint(LIST_TITLE, id))
  } catch (error) {
    throw new Error(`Failed to delete conversion value ${id}. ${(error as Error).message}`)
  }
}

export const deleteByInitiativeId = async (
  initiativeId: number,
  filters?: {
    readonly year?: number
    readonly scenario?: string
  },
): Promise<void> => {
  try {
    const currentItems = await listByInitiativeId(initiativeId, filters)
    await Promise.all(currentItems.map((item) => deleteById(item.Id)))
  } catch (error) {
    throw new Error(`Failed to delete conversion values for initiative ${initiativeId}. ${(error as Error).message}`)
  }
}
