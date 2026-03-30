import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'KPI_Master'
const CONTEXT_SITE_URL = sharePointContext.siteUrl


interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface KpiMasterListItem {
  readonly Id: number
  readonly Code: string
  readonly Title: string
  readonly Unit: string
  readonly Description?: string
  readonly Active: boolean
}

export const listAll = async (): Promise<readonly KpiMasterListItem[]> => {
  try {
    const response = await get<SharePointListResponse<KpiMasterListItem>>(listItemsEndpoint(LIST_TITLE, { orderBy: 'KPICode asc' }))
    return response.value
  } catch (error) {
    throw new Error(`Failed to list KPI master records from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`)
  }
}

export const getByCode = async (code: string): Promise<KpiMasterListItem | undefined> => {
  try {
    const response = await get<SharePointListResponse<KpiMasterListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `KPICode eq '${code.replace(/'/g, "''")}'`, { top: 1 }),
    )

    return response.value[0]
  } catch (error) {
    throw new Error(`Failed to get KPI master by code '${code}'. ${(error as Error).message}`)
  }
}
