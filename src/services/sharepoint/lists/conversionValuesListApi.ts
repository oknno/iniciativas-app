import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
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
  readonly InitiativeId?: number | string | SharePointLookupValue
  readonly InitiativeIdId?: number
  readonly Year: number
  readonly Month: number
  readonly Value: number
  readonly Scenario?: string
}

export const listAll = async (): Promise<readonly ConversionValueListItem[]> => {
  try {
    const response = await get<SharePointListResponse<ConversionValueListItem>>(
      listItemsEndpoint(LIST_TITLE, {
        select: 'Id,ConversionCode,ConversionCode/Title,ConversionCode/ConversionCode,InitiativeId,InitiativeIdId,InitiativeId/Id,Year,Month,Value,Scenario',
        expand: 'ConversionCode,InitiativeId',
        orderBy: 'Year asc,Month asc',
      }),
    )

    return response.value
  } catch {
    try {
      const response = await get<SharePointListResponse<ConversionValueListItem>>(
        listItemsEndpoint(LIST_TITLE, { orderBy: 'ConversionCode asc,Year asc,Month asc' }),
      )

      return response.value
    } catch (error) {
      throw new Error(`Failed to list conversion values records from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`)
    }
  }
}

export const getByCode = async (conversionCode: string): Promise<readonly ConversionValueListItem[]> => {
  try {
    const response = await get<SharePointListResponse<ConversionValueListItem>>(
      filteredListItemsEndpoint(
        LIST_TITLE,
        `ConversionCode/ConversionCode eq '${conversionCode.replace(/'/g, "''")}'`,
        {
          select: 'Id,ConversionCode,ConversionCode/Title,ConversionCode/ConversionCode,InitiativeId,InitiativeIdId,InitiativeId/Id,Year,Month,Value,Scenario',
          expand: 'ConversionCode,InitiativeId',
          orderBy: 'Year asc,Month asc',
        },
      ),
    )

    return response.value
  } catch {
    try {
      const response = await get<SharePointListResponse<ConversionValueListItem>>(
        filteredListItemsEndpoint(
          LIST_TITLE,
          `ConversionCode eq '${conversionCode.replace(/'/g, "''")}'`,
          { orderBy: 'Year asc,Month asc' },
        ),
      )

      return response.value
    } catch (error) {
      throw new Error(`Failed to get conversion values by code '${conversionCode}'. ${(error as Error).message}`)
    }
  }
}
