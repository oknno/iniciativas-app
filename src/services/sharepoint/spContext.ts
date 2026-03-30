export interface SharePointContextConfig {
  readonly siteUrl: string
  readonly apiBasePath: string
  readonly defaultHeaders: Readonly<Record<string, string>>
  readonly listItemEntityTypeNames: Readonly<Record<string, string>>
}

const normalizedSiteUrl = (import.meta.env.VITE_SP_SITE_URL as string | undefined)?.trim() ?? ''

const normalizedApiBasePath =
  (import.meta.env.VITE_SP_API_BASE_PATH as string | undefined)?.trim() || '/_api'

const toAbsoluteApiUrl = (siteUrl: string, apiBasePath: string): string => {
  const safeSite = siteUrl.replace(/\/$/, '')
  const safePath = apiBasePath.startsWith('/') ? apiBasePath : `/${apiBasePath}`

  return `${safeSite}${safePath}`
}

export const sharePointContext: SharePointContextConfig = {
  siteUrl: normalizedSiteUrl,
  apiBasePath: toAbsoluteApiUrl(normalizedSiteUrl, normalizedApiBasePath),
  defaultHeaders: {
    Accept: 'application/json;odata=nometadata',
  },
  listItemEntityTypeNames: {},
}
