import { useEffect, useMemo, useState } from 'react'
import { getInitiatives, removeInitiative } from '../../services/initiativeService'
import type { Initiative } from '../../types/initiative'

interface InitiativesPageProps {
  onCreateNewInitiative: () => void
  onStartFlow: (initiativeId: number) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

type ToastType = 'success' | 'error' | 'info'

interface ToastState {
  id: number
  type: ToastType
  message: string
}

interface Filters {
  unidade: string
  stage: string
  status: string
  responsavel: string
  title: string
}

const INITIAL_FILTERS: Filters = {
  unidade: '',
  stage: '',
  status: '',
  responsavel: '',
  title: '',
}

export function InitiativesPage({
  onCreateNewInitiative,
  onStartFlow,
}: InitiativesPageProps) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [draftFilters, setDraftFilters] = useState<Filters>(INITIAL_FILTERS)
  const [toasts, setToasts] = useState<ToastState[]>([])

  function showToast(type: ToastType, message: string) {
    const toastId = Date.now() + Math.random()
    setToasts((previous) => [...previous, { id: toastId, type, message }])
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== toastId))
    }, 3200)
  }

  async function loadInitiatives() {
    setLoading(true)
    setError(false)

    try {
      const data = await getInitiatives()
      setInitiatives(data)
      setSelectedId((current) => {
        if (!data.length) {
          return null
        }

        return current && data.some((initiative) => initiative.id === current)
          ? current
          : data[0].id
      })
    } catch {
      setError(true)
      setInitiatives([])
      setSelectedId(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadInitiatives()
  }, [])

  useEffect(() => {
    if (!isFilterOpen) {
      return
    }

    function handleOutside(event: MouseEvent) {
      const filterContainer = document.querySelector('[data-filter-container]')
      if (!filterContainer || !(event.target instanceof Node)) {
        return
      }

      if (!filterContainer.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isFilterOpen])

  const filteredInitiatives = useMemo(() => {
    const normalized = {
      unidade: filters.unidade.trim().toLocaleLowerCase(),
      stage: filters.stage.trim().toLocaleLowerCase(),
      status: filters.status.trim().toLocaleLowerCase(),
      responsavel: filters.responsavel.trim().toLocaleLowerCase(),
      title: filters.title.trim().toLocaleLowerCase(),
    }

    return initiatives.filter((initiative) => {
      return (
        (!normalized.unidade || initiative.unidade.toLocaleLowerCase().includes(normalized.unidade))
        && (!normalized.stage || initiative.stage.toLocaleLowerCase().includes(normalized.stage))
        && (!normalized.status || initiative.status.toLocaleLowerCase().includes(normalized.status))
        && (!normalized.responsavel || initiative.responsavel.toLocaleLowerCase().includes(normalized.responsavel))
        && (!normalized.title || initiative.title.toLocaleLowerCase().includes(normalized.title))
      )
    })
  }, [filters, initiatives])

  const selectedInitiative = useMemo(
    () => filteredInitiatives.find((initiative) => initiative.id === selectedId) ?? null,
    [filteredInitiatives, selectedId],
  )

  const units = useMemo(() => [...new Set(initiatives.map((initiative) => initiative.unidade))], [initiatives])
  const stages = useMemo(() => [...new Set(initiatives.map((initiative) => initiative.stage))], [initiatives])
  const statuses = useMemo(() => [...new Set(initiatives.map((initiative) => initiative.status))], [initiatives])
  const responsaveis = useMemo(() => [...new Set(initiatives.map((initiative) => initiative.responsavel))], [initiatives])

  const hasSelection = Boolean(selectedInitiative)

  function getStatusTone(status: string): 'neutral' | 'info' | 'success' | 'warning' | 'error' {
    if (status === 'Aprovada' || status === 'Concluída') return 'success'
    if (status === 'Em revisão' || status === 'Em validação') return 'info'
    if (status === 'Rascunho') return 'neutral'
    if (status === 'Em preenchimento') return 'warning'
    return 'neutral'
  }

  async function handleDelete() {
    if (!selectedInitiative) return

    try {
      await removeInitiative(selectedInitiative.id)
      setIsConfirmOpen(false)
      await loadInitiatives()
      showToast('success', 'Iniciativa excluída com sucesso.')
    } catch {
      setIsConfirmOpen(false)
      showToast('error', 'Não foi possível excluir a iniciativa selecionada.')
    }
  }

  return (
    <main className="initiatives-page">
      <header className="capex-topbar">
        <h1>Motor de Ganhos</h1>

        <div className="initiatives-actions" aria-label="Barra de ações da tela inicial" data-filter-container>
          <button type="button" className="btn" onClick={() => {
            void loadInitiatives()
            showToast('success', 'Iniciativas atualizadas com sucesso.')
          }}
          >
            Atualizar
          </button>
          <button type="button" className="btn primary" onClick={onCreateNewInitiative}>Nova iniciativa</button>
          <button
            type="button"
            className="btn"
            onClick={() => selectedInitiative && onStartFlow(selectedInitiative.id)}
            disabled={!hasSelection}
          >
            Visualizar
          </button>
          <button type="button" className="btn" disabled={!hasSelection}>Editar</button>
          <button type="button" className="btn" disabled={!hasSelection} onClick={() => setIsConfirmOpen(true)}>Excluir</button>
          <button type="button" className="btn" disabled={!hasSelection}>Enviar para aprovação</button>
          <button type="button" className="btn" disabled={!hasSelection}>Voltar status</button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setDraftFilters(filters)
              setIsFilterOpen((state) => !state)
            }}
          >
            Filtro
          </button>
          <button type="button" className="btn" onClick={() => showToast('info', 'Exportação iniciada.')}>Exportar</button>

          {isFilterOpen && (
            <div className="initiatives-filter-popover" role="dialog" aria-label="Filtro de iniciativas">
              <div className="initiatives-filter-grid">
                <label>
                  <span>Unidade</span>
                  <select value={draftFilters.unidade} onChange={(event) => setDraftFilters((state) => ({ ...state, unidade: event.target.value }))}>
                    <option value="">Todas</option>
                    {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </label>
                <label>
                  <span>Stage</span>
                  <select value={draftFilters.stage} onChange={(event) => setDraftFilters((state) => ({ ...state, stage: event.target.value }))}>
                    <option value="">Todos</option>
                    {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select value={draftFilters.status} onChange={(event) => setDraftFilters((state) => ({ ...state, status: event.target.value }))}>
                    <option value="">Todos</option>
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label>
                  <span>Responsável</span>
                  <select value={draftFilters.responsavel} onChange={(event) => setDraftFilters((state) => ({ ...state, responsavel: event.target.value }))}>
                    <option value="">Todos</option>
                    {responsaveis.map((responsavel) => <option key={responsavel} value={responsavel}>{responsavel}</option>)}
                  </select>
                </label>
                <label className="full-width">
                  <span>Título</span>
                  <input
                    type="text"
                    value={draftFilters.title}
                    onChange={(event) => setDraftFilters((state) => ({ ...state, title: event.target.value }))}
                    placeholder="Buscar por título"
                  />
                </label>
              </div>

              <div className="initiatives-filter-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setDraftFilters(INITIAL_FILTERS)
                    setFilters(INITIAL_FILTERS)
                    setSelectedId(initiatives[0]?.id ?? null)
                  }}
                >
                  Limpar
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    setFilters(draftFilters)
                    setIsFilterOpen(false)
                    showToast('info', 'Filtro aplicado.')
                  }}
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="initiatives-main-grid">
        <div className="initiatives-list-panel">
          {loading ? (
            <div className="initiatives-state">Carregando iniciativas...</div>
          ) : error ? (
            <div className="initiatives-state">Erro ao carregar iniciativas.</div>
          ) : filteredInitiatives.length === 0 ? (
            <div className="initiatives-state">Nenhuma iniciativa encontrada.</div>
          ) : (
            <table className="initiatives-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Unidade</th>
                  <th>Responsável</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Última atualização</th>
                </tr>
              </thead>
              <tbody>
                {filteredInitiatives.map((initiative) => {
                  const isSelected = initiative.id === selectedInitiative?.id
                  return (
                    <tr
                      key={initiative.id}
                      className={isSelected ? 'is-selected' : undefined}
                      onClick={() => setSelectedId(initiative.id)}
                    >
                      <td className="id-cell">MG-{String(initiative.id).padStart(3, '0')}</td>
                      <td title={initiative.title}>{initiative.title}</td>
                      <td>{initiative.unidade}</td>
                      <td>{initiative.responsavel}</td>
                      <td>{initiative.stage}</td>
                      <td>
                        <span className={`status-badge ${getStatusTone(initiative.status)}`}>{initiative.status}</span>
                      </td>
                      <td>{initiative.updatedAt ?? '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <aside className="initiatives-summary-panel">
          <h2>Resumo</h2>
          {selectedInitiative ? (
            <div className="initiatives-summary-meta">
              <p><strong>Título:</strong> {selectedInitiative.title}</p>
              <p><strong>Unidade:</strong> {selectedInitiative.unidade}</p>
              <p><strong>Responsável:</strong> {selectedInitiative.responsavel}</p>
              <p><strong>Stage:</strong> {selectedInitiative.stage}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-badge ${getStatusTone(selectedInitiative.status)}`}>
                  {selectedInitiative.status}
                </span>
              </p>
              <p><strong>Componentes:</strong> {selectedInitiative.componentsCount ?? 0}</p>
              <p><strong>Total estimado:</strong> {formatCurrency(selectedInitiative.estimatedTotal ?? selectedInitiative.budget ?? 0)}</p>
              <p><strong>Ganho acumulado:</strong> {formatCurrency(selectedInitiative.accumulatedGain ?? 0)}</p>
              <p><strong>Última atualização:</strong> {selectedInitiative.updatedAt ?? '-'}</p>
            </div>
          ) : (
            <p className="initiatives-summary-empty">Selecione uma iniciativa para visualizar o resumo.</p>
          )}
        </aside>
      </section>

      {isConfirmOpen && selectedInitiative && (
        <div className="dialog-overlay" role="presentation" onClick={() => setIsConfirmOpen(false)}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>Confirmar exclusão</h3>
            <p>
              Deseja excluir a iniciativa <strong>{selectedInitiative.title}</strong>?
            </p>
            <div className="confirm-dialog-actions">
              <button type="button" className="btn" onClick={() => setIsConfirmOpen(false)}>Cancelar</button>
              <button type="button" className="btn danger" onClick={() => void handleDelete()}>Confirmar exclusão</button>
            </div>
          </div>
        </div>
      )}

      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </main>
  )
}
