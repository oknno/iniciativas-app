import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { accessRepository, type AccessRole, type CurrentAccessContext } from '../../services/sharepoint/repositories/accessRepository'
import type { RuleActor } from '../../domain/initiatives/services/initiativePolicy'

export interface AccessState {
  readonly isLoading: boolean
  readonly errorMessage?: string
  readonly context?: CurrentAccessContext
  readonly actor?: RuleActor
  readonly isConfigured: boolean
  readonly hasFullDiagnosticsAccess: boolean
}

const AccessContext = createContext<AccessState | null>(null)

const mapRoleToActorRole = (role: AccessRole): RuleActor['role'] => role

export function AccessProvider({ children }: { readonly children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [context, setContext] = useState<CurrentAccessContext>()
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let isMounted = true

    void accessRepository
      .resolveCurrentAccess()
      .then((resolved) => {
        if (!isMounted) {
          return
        }

        setContext(resolved)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        setErrorMessage((error as Error).message)
      })
      .finally(() => {
        if (!isMounted) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const actor = useMemo<RuleActor | undefined>(() => {
    if (!context?.isConfigured || !context.role) {
      return undefined
    }

    return {
      user: context.currentUserLogin,
      role: mapRoleToActorRole(context.role),
    }
  }, [context])

  const value = useMemo<AccessState>(
    () => ({
      isLoading,
      errorMessage,
      context,
      actor,
      isConfigured: Boolean(context?.isConfigured),
      hasFullDiagnosticsAccess: Boolean(context?.isDevOrAdmin),
    }),
    [actor, context, errorMessage, isLoading],
  )

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
}

export const useAccess = (): AccessState => {
  const value = useContext(AccessContext)
  if (!value) {
    throw new Error('useAccess must be used inside AccessProvider')
  }

  return value
}
