export interface SharePointContextConfig {
  readonly siteUrl: string
  readonly apiBasePath: string
  readonly defaultHeaders: Readonly<Record<string, string>>
  readonly listItemEntityTypeNames: Readonly<Record<string, string>>
}

const configuredSiteUrl = 'https://arcelormittal.sharepoint.com/sites/ProjetosEstratgicos926'

const normalizedApiBasePath =
  (import.meta.env.VITE_SP_API_BASE_PATH as string | undefined)?.trim() || '/_api'

const toAbsoluteApiUrl = (siteUrl: string, apiBasePath: string): string => {
  const safeSite = siteUrl.replace(/\/$/, '')
  const safePath = apiBasePath.startsWith('/') ? apiBasePath : `/${apiBasePath}`

  return `${safeSite}${safePath}`
}

export const spContext: SharePointContextConfig = {
  siteUrl: configuredSiteUrl,
  apiBasePath: toAbsoluteApiUrl(configuredSiteUrl, normalizedApiBasePath),
  defaultHeaders: {
    Accept: 'application/json;odata=nometadata',
  },
  listItemEntityTypeNames: {},
}

export const sharePointContext = spContext
