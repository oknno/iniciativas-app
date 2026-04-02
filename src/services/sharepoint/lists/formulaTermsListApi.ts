import { get } from '../spHttp'
import { sharePointContext } from '../spContext'
import { filteredListItemsEndpoint } from '../spUrls'

const LIST_TITLE = 'Formula_Term'
const CONTEXT_SITE_URL = sharePointContext.siteUrl

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

export interface FormulaTermListItem {
  readonly Id: number
  readonly FormulaCode: string
  readonly ComponentType?: string
  readonly Order: number
  readonly Operation: string
  readonly Signal: number
  readonly CalculationType?: string
  readonly KPICode?: string
  readonly ConversionCode?: string
}

export const listByFormulaCode = async (formulaCode: string): Promise<readonly FormulaTermListItem[]> => {
  try {
    const response = await get<SharePointListResponse<FormulaTermListItem>>(
      filteredListItemsEndpoint(
        LIST_TITLE,
        `FormulaCode eq '${formulaCode.replace(/'/g, "''")}'`,
        { orderBy: 'Order asc' },
      ),
    )

    return response.value
  } catch (error) {
    throw new Error(
      `Failed to list formula terms for formula '${formulaCode}' from ${CONTEXT_SITE_URL || 'configured SharePoint site'}. ${(error as Error).message}`,
    )
  }
}
