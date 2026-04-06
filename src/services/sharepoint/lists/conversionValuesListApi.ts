import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
import { assertListFieldType } from '../listSchema'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

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
