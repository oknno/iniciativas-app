import { useEffect, useMemo, useState } from 'react'
import { getInitiatives } from '../../services/initiativeService'
import type { Initiative } from '../../types/initiative'

interface InitiativesPageProps {
  onCreateNewInitiative: () => void
  onStartFlow: (initiativeId: number) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

export function InitiativesPage({
  onCreateNewInitiative,
  onStartFlow,
}: InitiativesPageProps) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    async function loadInitiatives() {
      try {
        const data = await getInitiatives()
        setInitiatives(data)
        setSelectedId(data[0]?.id ?? null)
      } finally {
        setLoading(false)
      }
    }

    void loadInitiatives()
  }, [])

  const selectedInitiative = useMemo(
    () => initiatives.find((initiative) => initiative.id === selectedId) ?? initiatives[0] ?? null,
    [initiatives, selectedId],
  )

  return (
    <main style={{ fontFamily: 'Arial, sans-serif' }}>
      <header className="capex-topbar">
        <h1 style={{ margin: 0 }}>Initiative Value Engine</h1>
        <p style={{ margin: 0, color: "#4b5563" }}>Fluxo único: KPI/Ganho → Compensação/Custo → Valores mensais → Resultado.</p>

        <div className="capex-topbar-actions">
          <button
            type="button"
            className="btn"
            onClick={() => selectedInitiative && onStartFlow(selectedInitiative.id)}
            disabled={!selectedInitiative}
          >
            Iniciar fluxo (1/4)
          </button>
          <button type="button" className="btn primary" onClick={onCreateNewInitiative}>
            Nova iniciativa
          </button>
        </div>
      </header>

      {loading ? (
        <p>Carregando iniciativas...</p>
      ) : (
        <section style={gridStyle}>
          <div style={listPanelStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Título</th>
                  <th style={thStyle}>Unidade</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {initiatives.map((initiative) => {
                  const isSelected = initiative.id === selectedInitiative?.id
                  return (
                    <tr
                      key={initiative.id}
                      style={{ background: isSelected ? '#eef2ff' : '#fff', cursor: 'pointer' }}
                      onClick={() => setSelectedId(initiative.id)}
                    >
                      <td style={tdStyle}>{initiative.id}</td>
                      <td style={tdStyle}>{initiative.title}</td>
                      <td style={tdStyle}>{initiative.unidade}</td>
                      <td style={tdStyle}>{initiative.status}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <aside style={summaryPanelStyle}>
            {selectedInitiative ? (
              <>
                <h2 style={{ marginTop: 0, marginBottom: '8px' }}>{selectedInitiative.title}</h2>
                <p style={{ marginTop: 0 }}>
                  <strong>Status:</strong> {selectedInitiative.status} • <strong>Stage:</strong> {selectedInitiative.stage}
                </p>
                <p style={{ margin: '6px 0' }}><strong>Unidade:</strong> {selectedInitiative.unidade}</p>
                <p style={{ margin: '6px 0' }}><strong>Responsável:</strong> {selectedInitiative.responsavel}</p>
                <p style={{ margin: '6px 0' }}><strong>Orçamento:</strong> {formatCurrency(selectedInitiative.budget ?? 0)}</p>
                <p style={{ margin: '6px 0' }}>
                  <strong>Início / Fim:</strong> {selectedInitiative.startDate ?? '-'} → {selectedInitiative.endDate ?? '-'}
                </p>

                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />

                <h3 style={{ marginBottom: '4px' }}>Business Need</h3>
                <p style={{ marginTop: 0 }}>{selectedInitiative.businessNeed ?? '-'}</p>

                <h3 style={{ marginBottom: '4px' }}>Proposed Solution</h3>
                <p style={{ marginTop: 0 }}>{selectedInitiative.proposedSolution ?? '-'}</p>
              </>
            ) : (
              <p>Selecione uma iniciativa para ver o resumo.</p>
            )}
          </aside>
        </section>
      )}
    </main>
  )
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr',
  gap: '12px',
}

const listPanelStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
  background: '#fff',
}

const summaryPanelStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  background: '#fff',
  padding: '12px',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f8fafc',
}

const tdStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #f1f5f9',
}
