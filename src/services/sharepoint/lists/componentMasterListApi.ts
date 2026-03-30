import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Component_Master'
const CONTEXT_SITE_URL = sharePointContext.siteUrl


interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface ComponentMasterListItem {
  readonly Id: number
  readonly Code: string
  readonly Title: string
  readonly Description?: string
  readonly ComponentType: string
  readonly DefaultDirection: number
  readonly DefaultCalculationType: string
  readonly Active: boolean
}

export const listAll = async (): Promise<readonly ComponentMasterListItem[]> => {
  try {
    const response = await get<SharePointListResponse<ComponentMasterListItem>>(
      listItemsEndpoint(LIST_TITLE, { orderBy: 'Title asc' }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list component master records from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`)
  }
}

export const getByCode = async (code: string): Promise<ComponentMasterListItem | undefined> => {
  try {
    const response = await get<SharePointListResponse<ComponentMasterListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `ComponentType eq '${code.replace(/'/g, "''")}'`, { top: 1 }),
    )

    return response.value[0]
  } catch (error) {
    throw new Error(`Failed to get component master by code '${code}'. ${(error as Error).message}`)
  }
}
