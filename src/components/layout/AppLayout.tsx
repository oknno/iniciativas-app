import type { PropsWithChildren } from 'react'

interface AppLayoutProps extends PropsWithChildren {
  isInitiativesActive: boolean
  onGoToInitiatives: () => void
}

export function AppLayout({
  children,
  isInitiativesActive,
  onGoToInitiatives,
}: AppLayoutProps) {
  return (
    <div className="capex-app-shell">
      <div className="capex-app">
        <header className="capex-header">
          <div className="capex-header-inner">
            <div className="capex-title">
              <button type="button" onClick={onGoToInitiatives} className="capex-brand">
                Iniciativas App
              </button>
              <span className="capex-badge">PoC</span>
            </div>
            <nav className="capex-actions">
              <button
                type="button"
                className={`btn ${isInitiativesActive ? 'primary' : ''}`}
                onClick={onGoToInitiatives}
              >
                Iniciativas
              </button>
            </nav>
          </div>
        </header>

        <main className="capex-container">{children}</main>
      </div>
    </div>
  )
}
