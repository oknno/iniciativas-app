import { get } from '../spHttp'
import { filteredListItemsEndpoint } from '../spUrls'
import { sharePointContext } from '../spContext'

const ACCESS_LIST_TITLE = 'User_Access'

const ALLOWED_ACCESS_ROLES = ['OWNER', 'CTRL_LOCAL', 'CTRL_ESTRATEGICA', 'DEV', 'ADMIN'] as const
export type AccessRole = (typeof ALLOWED_ACCESS_ROLES)[number]

interface SharePointCurrentUserResponse {
  readonly Email?: string
  readonly LoginName?: string
  readonly Title?: string
}

interface SharePointListResponse<TItem> {
  readonly value: readonly TItem[]
}

interface UserAccessListItem {
  readonly Id: number
  readonly Title?: string
  readonly UserLogin?: string
  readonly Role?: string
  readonly Unit?: string
  readonly IsActive?: boolean | number
}

export interface CurrentAccessContext {
  readonly currentUserLogin: string
  readonly currentUserTitle: string
  readonly role?: AccessRole
  readonly unit?: string
  readonly isConfigured: boolean
  readonly isDevOrAdmin: boolean
}

const normalizeIdentity = (value?: string): string => value?.trim().toLowerCase() ?? ''

const toAccessRole = (role?: string): AccessRole | undefined => {
  if (!role) {
    return undefined
  }

  const normalizedRole = role.trim().toUpperCase()
  return ALLOWED_ACCESS_ROLES.find((allowedRole) => allowedRole === normalizedRole)
}

const isActiveValue = (value: UserAccessListItem['IsActive']): boolean => value === true || value === 1

const quoteOData = (value: string): string => `'${value.replace(/'/g, "''")}'`

const getCurrentUserSafe = async (): Promise<SharePointCurrentUserResponse> => {
  const endpoint = `${sharePointContext.apiBasePath}/web/currentuser?$select=Email,LoginName,Title`
  return get<SharePointCurrentUserResponse>(endpoint)
}

const loadActiveAccessEntries = async (userLogin: string): Promise<readonly UserAccessListItem[]> => {
  const select = 'Id,Title,UserLogin,Role,Unit,IsActive'
  const normalizedLogin = normalizeIdentity(userLogin)
  const filter = `IsActive eq 1 and UserLogin eq ${quoteOData(normalizedLogin)}`
  const response = await get<SharePointListResponse<UserAccessListItem>>(
    filteredListItemsEndpoint(ACCESS_LIST_TITLE, filter, { select, orderBy: 'Id desc' }),
  )
  return response.value.filter((item) => isActiveValue(item.IsActive))
}

const resolvePriorityRole = (items: readonly UserAccessListItem[]): AccessRole | undefined => {
  const rolePriority: readonly AccessRole[] = ['ADMIN', 'DEV', 'OWNER', 'CTRL_ESTRATEGICA', 'CTRL_LOCAL']

  for (const role of rolePriority) {
    if (items.some((item) => toAccessRole(item.Role) === role)) {
      return role
    }
  }

  return undefined
}

export const accessRepository = {
  async resolveCurrentAccess(): Promise<CurrentAccessContext> {
    let currentUser: SharePointCurrentUserResponse
    try {
      currentUser = await getCurrentUserSafe()
    } catch (error) {
      throw new Error(`Falha ao identificar usuário atual no SharePoint. ${(error as Error).message}`)
    }

    const normalizedLogin = normalizeIdentity(currentUser.Email ?? currentUser.LoginName)

    if (!normalizedLogin) {
      return {
        currentUserLogin: '',
        currentUserTitle: currentUser.Title?.trim() || 'Usuário desconhecido',
        isConfigured: false,
        isDevOrAdmin: false,
      }
    }

    try {
      const items = await loadActiveAccessEntries(normalizedLogin)
      const role = resolvePriorityRole(items)
      const highestPriorityItem = role ? items.find((item) => toAccessRole(item.Role) === role) : undefined

      return {
        currentUserLogin: normalizedLogin,
        currentUserTitle: currentUser.Title?.trim() || normalizedLogin,
        role,
        unit: highestPriorityItem?.Unit?.trim() || undefined,
        isConfigured: Boolean(role),
        isDevOrAdmin: role === 'DEV' || role === 'ADMIN',
      }
    } catch (error) {
      throw new Error(`Falha ao consultar lista '${ACCESS_LIST_TITLE}'. ${(error as Error).message}`)
    }
  },
}
