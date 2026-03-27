import type { PropsWithChildren } from 'react'

interface AppLayoutProps extends PropsWithChildren {}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="capex-app-shell">
      <div className="capex-app">
        <main className="capex-container">{children}</main>
      </div>
    </div>
  )
}
