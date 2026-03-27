import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getInitiatives } from '../../services/initiativeService'
import type { Initiative } from '../../types/initiative'

export function InitiativesPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInitiatives() {
      try {
        const data = await getInitiatives()
        setInitiatives(data)
      } finally {
        setLoading(false)
      }
    }

    void loadInitiatives()
  }, [])

  return (
    <main>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Iniciativas</h1>
          <p style={{ marginTop: '8px' }}>
            PoC v0001 do sistema de iniciativas
          </p>
        </div>

        <Link
          to="/initiatives/new"
          style={{
            padding: '10px 16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: '#fff',
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#111827',
          }}
        >
          Nova iniciativa
        </Link>
      </header>

      {loading ? (
        <p>Carregando iniciativas...</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd',
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Título</th>
              <th style={thStyle}>Unidade</th>
              <th style={thStyle}>Responsável</th>
              <th style={thStyle}>Stage</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Fluxo</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map((initiative) => (
              <tr key={initiative.id}>
                <td style={tdStyle}>{initiative.id}</td>
                <td style={tdStyle}>{initiative.title}</td>
                <td style={tdStyle}>{initiative.unidade}</td>
                <td style={tdStyle}>{initiative.responsavel}</td>
                <td style={tdStyle}>{initiative.stage}</td>
                <td style={tdStyle}>{initiative.status}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link to={`/initiatives/${initiative.id}/components`}>Componentes</Link>
                    <Link to={`/initiatives/${initiative.id}/values`}>Valores</Link>
                    <Link to={`/initiatives/${initiative.id}/result`}>Resultado</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f5f5f5',
}

const tdStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #eee',
}
