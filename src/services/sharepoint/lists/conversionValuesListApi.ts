import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Conversion_Values'
const CONTEXT_SITE_URL = sharePointContext.siteUrl


interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface ConversionValueListItem {
  readonly Id: number
  readonly ConversionCode: string
  readonly MonthRef: string
  readonly Scenario: string
  readonly Value: number
}

export const listAll = async (): Promise<readonly ConversionValueListItem[]> => {
  try {
    const response = await get<SharePointListResponse<ConversionValueListItem>>(
      listItemsEndpoint(LIST_TITLE, { orderBy: 'ConversionCode asc,MonthRef asc' }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list conversion values records from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`)
  }
}

export const getByCode = async (conversionCode: string): Promise<readonly ConversionValueListItem[]> => {
  try {
    const response = await get<SharePointListResponse<ConversionValueListItem>>(
      filteredListItemsEndpoint(
        LIST_TITLE,
        `ConversionCode eq '${conversionCode.replace(/'/g, "''")}'`,
        { orderBy: 'MonthRef asc' },
      ),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to get conversion values by code '${conversionCode}'. ${(error as Error).message}`)
  }
}
