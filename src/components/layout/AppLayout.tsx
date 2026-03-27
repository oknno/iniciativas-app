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
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button type="button" onClick={onGoToInitiatives} style={brandStyle}>
          Iniciativas App
        </button>

        <nav style={navStyle}>
          <button
            type="button"
            style={navButtonStyle(isInitiativesActive)}
            onClick={onGoToInitiatives}
          >
            Iniciativas
          </button>
        </nav>
      </header>

      <main style={contentStyle}>{children}</main>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f8fafc',
}

const headerStyle: React.CSSProperties = {
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#fff',
}

const brandStyle: React.CSSProperties = {
  color: '#0f172a',
  fontWeight: 700,
  fontSize: '1rem',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
}

const navButtonStyle = (isActive: boolean): React.CSSProperties => ({
  color: isActive ? '#1d4ed8' : '#334155',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
})

const contentStyle: React.CSSProperties = {
  padding: '24px',
}
