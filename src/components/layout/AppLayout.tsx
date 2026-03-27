import type { PropsWithChildren } from 'react'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="capex-app-shell">
      <div className="capex-app">
        <main className="capex-container">{children}</main>
      </div>
    </div>
  )
}
