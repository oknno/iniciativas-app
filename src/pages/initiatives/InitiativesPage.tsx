import { useEffect, useState } from 'react'
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

    loadInitiatives()
  }, [])

  return (
    <main style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
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

        <button
          type="button"
          style={{
            padding: '10px 16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Nova iniciativa
        </button>
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