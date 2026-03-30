import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Conversion_Master'
const CONTEXT_SITE_URL = sharePointContext.siteUrl


interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface ConversionMasterListItem {
  readonly Id: number
  readonly Code: string
  readonly Title: string
  readonly SourceUnit: string
  readonly TargetUnit: string
  readonly Description?: string
  readonly Active: boolean
}

export const listAll = async (): Promise<readonly ConversionMasterListItem[]> => {
  try {
    const response = await get<SharePointListResponse<ConversionMasterListItem>>(
      listItemsEndpoint(LIST_TITLE, { orderBy: 'Code asc' }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list conversion master records from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`)
  }
}

export const getByCode = async (code: string): Promise<ConversionMasterListItem | undefined> => {
  try {
    const response = await get<SharePointListResponse<ConversionMasterListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `Code eq '${code.replace(/'/g, "''")}'`, { top: 1 }),
    )

    return response.value[0]
  } catch (error) {
    throw new Error(`Failed to get conversion master by code '${code}'. ${(error as Error).message}`)
  }
}
