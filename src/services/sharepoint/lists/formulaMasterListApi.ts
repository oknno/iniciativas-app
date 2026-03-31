import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint, listItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Formula_Master'
const CONTEXT_SITE_URL = sharePointContext.siteUrl

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface FormulaMasterListItem {
  readonly Id: number
  readonly Title: string
  readonly FormulaCode: string
  readonly FormulaType: string
}

export const listAll = async (): Promise<readonly FormulaMasterListItem[]> => {
  try {
    const response = await get<SharePointListResponse<FormulaMasterListItem>>(
      listItemsEndpoint(LIST_TITLE, { orderBy: 'FormulaCode asc' }),
    )

    return response.value
  } catch (error) {
    throw new Error(`Failed to list formula master records from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`)
  }
}

export const getByCode = async (code: string): Promise<FormulaMasterListItem | undefined> => {
  try {
    const response = await get<SharePointListResponse<FormulaMasterListItem>>(
      filteredListItemsEndpoint(LIST_TITLE, `FormulaCode eq '${code.replace(/'/g, "''")}'`, { top: 1 }),
    )

    return response.value[0]
  } catch (error) {
    throw new Error(`Failed to get formula master by code '${code}'. ${(error as Error).message}`)
  }
}
