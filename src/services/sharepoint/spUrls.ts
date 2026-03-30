import { sharePointContext } from './spContext'

const escapeODataString = (value: string): string => value.replace(/'/g, "''")

const joinQuery = (segments: ReadonlyArray<string>): string => {
  const filtered = segments.filter((segment) => segment.trim().length > 0)
  if (filtered.length === 0) {
    return ''
  }

  return `?${filtered.join('&')}`
}

export interface SharePointItemsQueryOptions {
  readonly select?: string
  readonly expand?: string
  readonly orderBy?: string
  readonly top?: number
}

export const listEndpoint = (listTitle: string): string =>
  `${sharePointContext.apiBasePath}/web/lists/getbytitle('${escapeODataString(listTitle)}')`

export const listItemsEndpoint = (listTitle: string, options?: SharePointItemsQueryOptions): string => {
  if (!options) {
    return `${listEndpoint(listTitle)}/items`
  }

  const query = joinQuery([
    options.select ? `$select=${encodeURIComponent(options.select)}` : '',
    options.expand ? `$expand=${encodeURIComponent(options.expand)}` : '',
    options.orderBy ? `$orderby=${encodeURIComponent(options.orderBy)}` : '',
    typeof options.top === 'number' ? `$top=${options.top}` : '',
  ])

  return `${listEndpoint(listTitle)}/items${query}`
}

export const filteredListItemsEndpoint = (
  listTitle: string,
  filter: string,
  options?: Omit<SharePointItemsQueryOptions, 'top'> & { readonly top?: number },
): string => {
  const query = joinQuery([
    `$filter=${encodeURIComponent(filter)}`,
    options?.select ? `$select=${encodeURIComponent(options.select)}` : '',
    options?.expand ? `$expand=${encodeURIComponent(options.expand)}` : '',
    options?.orderBy ? `$orderby=${encodeURIComponent(options.orderBy)}` : '',
    typeof options?.top === 'number' ? `$top=${options.top}` : '',
  ])

  return `${listEndpoint(listTitle)}/items${query}`
}

export const listItemByIdEndpoint = (listTitle: string, id: number): string => `${listEndpoint(listTitle)}/items(${id})`
