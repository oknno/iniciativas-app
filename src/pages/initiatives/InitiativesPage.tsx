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

  const defaultActionButtons = [
    'Atualizar',
    'Editar',
    'Excluir',
    'Enviar para aprovação',
    'Voltar status',
    'Filtro',
    'Exportar',
  ]

  return (
    <main className="initiatives-page">
      <header className="initiatives-page-header">
        <h1>Gestão de Iniciativas</h1>

        <div className="initiatives-actions" aria-label="Barra de ações da tela inicial">
          <button type="button" className="btn">Atualizar</button>
          <button type="button" className="btn primary" onClick={onCreateNewInitiative}>Nova iniciativa</button>
          <button
            type="button"
            className="btn"
            onClick={() => selectedInitiative && onStartFlow(selectedInitiative.id)}
            disabled={!selectedInitiative}
          >
            Visualizar
          </button>
          {defaultActionButtons.slice(1).map((label) => (
            <button key={label} type="button" className="btn" disabled>
              {label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <p>Carregando iniciativas...</p>
      ) : (
        <section className="initiatives-main-grid">
          <div className="initiatives-list-panel">
            <table className="initiatives-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Unidade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {initiatives.map((initiative) => {
                  const isSelected = initiative.id === selectedInitiative?.id
                  return (
                    <tr
                      key={initiative.id}
                      className={isSelected ? 'is-selected' : undefined}
                      onClick={() => setSelectedId(initiative.id)}
                    >
                      <td>{initiative.id}</td>
                      <td>{initiative.title}</td>
                      <td>{initiative.unidade}</td>
                      <td>{initiative.status}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <aside className="initiatives-summary-panel">
            {selectedInitiative ? (
              <>
                <div className="initiatives-summary-heading">
                  <h2>{selectedInitiative.title}</h2>
                  <span className="initiatives-status-pill">{selectedInitiative.status}</span>
                </div>

                <div className="initiatives-summary-meta">
                  <p><strong>Status:</strong> {selectedInitiative.status}</p>
                  <p><strong>Stage:</strong> {selectedInitiative.stage}</p>
                  <p><strong>Unidade:</strong> {selectedInitiative.unidade}</p>
                  <p><strong>Responsável:</strong> {selectedInitiative.responsavel}</p>
                  <p><strong>Orçamento:</strong> {formatCurrency(selectedInitiative.budget ?? 0)}</p>
                  <p><strong>Início / Fim:</strong> {selectedInitiative.startDate ?? '-'} → {selectedInitiative.endDate ?? '-'}</p>
                </div>

                <hr />

                <h3>Business Need</h3>
                <p>{selectedInitiative.businessNeed ?? '-'}</p>

                <h3>Proposed Solution</h3>
                <p>{selectedInitiative.proposedSolution ?? '-'}</p>
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
