import { Link, NavLink, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <Link to="/initiatives" style={brandStyle}>
          Iniciativas App
        </Link>

        <nav style={navStyle}>
          <NavLink to="/initiatives" style={navLinkStyle}>
            Iniciativas
          </NavLink>
        </nav>
      </header>

      <main style={contentStyle}>
        <Outlet />
      </main>
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
  textDecoration: 'none',
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
}

const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? '#1d4ed8' : '#334155',
  textDecoration: 'none',
  fontWeight: 600,
})

const contentStyle: React.CSSProperties = {
  padding: '24px',
}
