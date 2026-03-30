import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { tokens } from '../ui/tokens'

export type ToastTone = 'success' | 'info' | 'warning' | 'error'

export type ToastInput = {
  title: string
  message?: string
  tone?: ToastTone
  durationMs?: number
}

type ToastItem = ToastInput & {
  id: number
  tone: ToastTone
}

type ToastContextValue = {
  pushToast: (input: ToastInput) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

const toneBorder: Record<ToastTone, string> = {
  success: '#16a34a',
  info: tokens.colors.accent,
  warning: '#d97706',
  error: '#dc2626',
}

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushToast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const tone = input.tone ?? 'info'
    const durationMs = input.durationMs ?? 2600

    setToasts((prev) => [...prev, { ...input, id, tone }])

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, durationMs)
  }, [])

  const contextValue = useMemo<ToastContextValue>(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: tokens.spacing.lg,
          right: tokens.spacing.lg,
          display: 'grid',
          gap: tokens.spacing.sm,
          zIndex: tokens.zIndex.toast,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              minWidth: 280,
              background: tokens.colors.surface,
              border: `1px solid ${tokens.colors.border}`,
              borderLeft: `4px solid ${toneBorder[toast.tone]}`,
              borderRadius: tokens.radius.sm,
              boxShadow: tokens.shadow.md,
              padding: tokens.spacing.sm,
            }}
          >
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{toast.title}</p>
            {toast.message ? (
              <p style={{ margin: '4px 0 0', fontSize: 13, color: tokens.colors.textSecondary }}>
                {toast.message}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
