import { useEffect, useMemo, useState } from 'react'
import { getInitiatives } from '../../services/initiativeService'
import type { Initiative } from '../../types/initiative'

interface InitiativesPageProps {
  onCreateNewInitiative: () => void
  onOpenComponents: (initiativeId: number) => void
  onOpenValues: (initiativeId: number) => void
  onOpenResult: (initiativeId: number) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

export function InitiativesPage({
  onCreateNewInitiative,
  onOpenComponents,
  onOpenValues,
  onOpenResult,
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

  const summary = useMemo(() => {
    const totalBudget = initiatives.reduce((sum, initiative) => sum + (initiative.budget ?? 0), 0)
    const emAprovacao = initiatives.filter((initiative) => initiative.status === 'Em aprovação').length
    const ativas = initiatives.filter((initiative) => initiative.status === 'Ativa' || initiative.status === 'Em validação').length

    return {
      total: initiatives.length,
      totalBudget,
      emAprovacao,
      ativas,
    }
  }, [initiatives])

  return (
    <main style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Jornada das iniciativas</h1>
          <p style={{ marginTop: '8px', color: '#4b5563' }}>
            Visualização macro das iniciativas e acesso rápido ao cadastro.
          </p>
        </div>

        <button type="button" className="btn primary" onClick={onCreateNewInitiative}>
          Nova iniciativa
        </button>
      </header>

      <section style={kpiCardsStyle}>
        <article style={cardStyle}>
          <strong style={cardValueStyle}>{summary.total}</strong>
          <span style={cardLabelStyle}>Iniciativas totais</span>
        </article>
        <article style={cardStyle}>
          <strong style={cardValueStyle}>{summary.ativas}</strong>
          <span style={cardLabelStyle}>Ativas / em validação</span>
        </article>
        <article style={cardStyle}>
          <strong style={cardValueStyle}>{summary.emAprovacao}</strong>
          <span style={cardLabelStyle}>Em aprovação</span>
        </article>
        <article style={cardStyle}>
          <strong style={cardValueStyle}>{formatCurrency(summary.totalBudget)}</strong>
          <span style={cardLabelStyle}>Orçamento acumulado</span>
        </article>
      </section>

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

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <button type="button" className="btn" onClick={() => onOpenComponents(selectedInitiative.id)}>
                    Componentes
                  </button>
                  <button type="button" className="btn" onClick={() => onOpenValues(selectedInitiative.id)}>
                    Valores
                  </button>
                  <button type="button" className="btn" onClick={() => onOpenResult(selectedInitiative.id)}>
                    Resultado
                  </button>
                </div>
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

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
}

const kpiCardsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))',
  gap: '10px',
  marginBottom: '14px',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '12px',
  display: 'grid',
}

const cardValueStyle: React.CSSProperties = {
  fontSize: '22px',
}

const cardLabelStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '13px',
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
