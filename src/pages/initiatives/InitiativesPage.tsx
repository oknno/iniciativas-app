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

interface InitiativesCommandBarProps {
  hasSelection: boolean
  draftFilters: Filters
  isFilterOpen: boolean
  units: string[]
  stages: string[]
  statuses: string[]
  responsaveis: string[]
  onRefresh: () => void
  onCreateNewInitiative: () => void
  onOpenSelected: () => void
  onDelete: () => void
  onToggleFilter: () => void
  onExport: () => void
  onDraftFilterChange: (nextState: Filters) => void
  onClearFilters: () => void
  onApplyFilters: () => void
}

function InitiativesCommandBar({
  hasSelection,
  draftFilters,
  isFilterOpen,
  units,
  stages,
  statuses,
  responsaveis,
  onRefresh,
  onCreateNewInitiative,
  onOpenSelected,
  onDelete,
  onToggleFilter,
  onExport,
  onDraftFilterChange,
  onClearFilters,
  onApplyFilters,
}: InitiativesCommandBarProps) {
  return (
    <header className="initiatives-command-bar" aria-label="Barra de ações da tela inicial" data-filter-container>
      <div className="initiatives-command-groups">
        <div className="actions-group">
          <button type="button" className="btn compact" onClick={onRefresh}>Atualizar</button>
          <button type="button" className="btn primary compact" onClick={onCreateNewInitiative}>Nova</button>
        </div>

        <span className="actions-divider" aria-hidden="true" />

        <div className="actions-group">
          <button type="button" className="btn compact" onClick={onOpenSelected} disabled={!hasSelection}>Visualizar</button>
          <button type="button" className="btn compact" disabled={!hasSelection}>Editar</button>
          <button type="button" className="btn compact" disabled={!hasSelection} onClick={onDelete}>Excluir</button>
        </div>

        <span className="actions-divider" aria-hidden="true" />

        <div className="actions-group">
          <button type="button" className="btn compact" disabled={!hasSelection}>Enviar</button>
          <button type="button" className="btn compact" disabled={!hasSelection}>Voltar</button>
        </div>

        <span className="actions-divider" aria-hidden="true" />

        <div className="actions-group">
          <button type="button" className="btn compact" onClick={onToggleFilter}>Filtro</button>
          <button type="button" className="btn compact" onClick={onExport}>Exportar</button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="initiatives-filter-popover" role="dialog" aria-label="Filtro de iniciativas">
          <div className="initiatives-filter-grid">
            <label>
              <span>Unidade</span>
              <select value={draftFilters.unidade} onChange={(event) => onDraftFilterChange({ ...draftFilters, unidade: event.target.value })}>
                <option value="">Todas</option>
                {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </label>
            <label>
              <span>Stage</span>
              <select value={draftFilters.stage} onChange={(event) => onDraftFilterChange({ ...draftFilters, stage: event.target.value })}>
                <option value="">Todos</option>
                {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={draftFilters.status} onChange={(event) => onDraftFilterChange({ ...draftFilters, status: event.target.value })}>
                <option value="">Todos</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label>
              <span>Responsável</span>
              <select value={draftFilters.responsavel} onChange={(event) => onDraftFilterChange({ ...draftFilters, responsavel: event.target.value })}>
                <option value="">Todos</option>
                {responsaveis.map((responsavel) => <option key={responsavel} value={responsavel}>{responsavel}</option>)}
              </select>
            </label>
            <label className="full-width">
              <span>Título</span>
              <input
                type="text"
                value={draftFilters.title}
                onChange={(event) => onDraftFilterChange({ ...draftFilters, title: event.target.value })}
                placeholder="Buscar por título"
              />
            </label>
          </div>

          <div className="initiatives-filter-footer">
            <button type="button" className="btn" onClick={onClearFilters}>Limpar</button>
            <button type="button" className="btn primary" onClick={onApplyFilters}>Aplicar filtros</button>
          </div>
        </div>
      )}

      <h1 className="initiatives-page-title">Motor de Ganhos</h1>
    </header>
  )
}

interface InitiativesTableSectionProps {
  loading: boolean
  error: boolean
  initiatives: Initiative[]
  selectedInitiative: Initiative | null
  onSelect: (id: number) => void
  getStatusTone: (status: string) => 'neutral' | 'info' | 'success' | 'warning' | 'error'
}

function InitiativesTableSection({
  loading,
  error,
  initiatives,
  selectedInitiative,
  onSelect,
  getStatusTone,
}: InitiativesTableSectionProps) {
  if (loading) {
    return <div className="initiatives-state">Carregando iniciativas...</div>
  }

  if (error) {
    return <div className="initiatives-state">Erro ao carregar iniciativas.</div>
  }

  if (initiatives.length === 0) {
    return <div className="initiatives-state">Nenhuma iniciativa encontrada.</div>
  }

  return (
    <div className="initiatives-table-section" role="table" aria-label="Tabela de iniciativas">
      <div className="initiatives-table-header" role="rowgroup">
        <div role="row">
          <div role="columnheader">ID</div>
          <div role="columnheader">Título</div>
          <div role="columnheader">Unidade</div>
          <div role="columnheader">Stage</div>
          <div role="columnheader">Status</div>
        </div>
      </div>

      <div className="initiatives-table-body" role="rowgroup">
        {initiatives.map((initiative) => {
          const isSelected = initiative.id === selectedInitiative?.id
          return (
            <button
              key={initiative.id}
              type="button"
              className={`initiatives-table-row ${isSelected ? 'is-selected' : ''}`}
              role="row"
              onClick={() => onSelect(initiative.id)}
            >
              <span className="id-cell" role="cell">MG-{String(initiative.id).padStart(3, '0')}</span>
              <span role="cell" title={initiative.title}>{initiative.title}</span>
              <span role="cell">{initiative.unidade}</span>
              <span role="cell">{initiative.stage}</span>
              <span role="cell">
                <span className={`status-badge ${getStatusTone(initiative.status)}`}>{initiative.status}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface InitiativesSummarySectionProps {
  selectedInitiative: Initiative | null
  getStatusTone: (status: string) => 'neutral' | 'info' | 'success' | 'warning' | 'error'
}

function InitiativesSummarySection({ selectedInitiative, getStatusTone }: InitiativesSummarySectionProps) {
  if (!selectedInitiative) {
    return <p className="initiatives-summary-empty">Selecione uma iniciativa para visualizar o resumo.</p>
  }

  return (
    <div className="initiatives-summary-content">
      <h2>Resumo</h2>

      <div className="summary-header">
        <h3 className="summary-initiative-title">{selectedInitiative.title}</h3>
        <span className={`status-badge ${getStatusTone(selectedInitiative.status)}`}>
          {selectedInitiative.status}
        </span>
      </div>

      <div className="summary-divider" />

      <dl className="summary-fields">
        <div><dt>Código / ID</dt><dd>MG-{String(selectedInitiative.id).padStart(3, '0')}</dd></div>
        <div><dt>Unidade</dt><dd>{selectedInitiative.unidade}</dd></div>
        <div><dt>Responsável</dt><dd>{selectedInitiative.responsavel}</dd></div>
        <div><dt>Stage</dt><dd>{selectedInitiative.stage}</dd></div>
        <div><dt>Status</dt><dd>{selectedInitiative.status}</dd></div>
        <div><dt>Componentes</dt><dd>{selectedInitiative.componentsCount ?? 0}</dd></div>
        <div><dt>Total estimado</dt><dd>{formatCurrency(selectedInitiative.estimatedTotal ?? selectedInitiative.budget ?? 0)}</dd></div>
        <div><dt>Ganho acumulado</dt><dd>{formatCurrency(selectedInitiative.accumulatedGain ?? 0)}</dd></div>
        <div><dt>Última atualização</dt><dd>{selectedInitiative.updatedAt ?? '-'}</dd></div>
      </dl>

      <div className="summary-divider" />

      <section className="summary-section">
        <h4>Objetivo da iniciativa</h4>
        <p>
          {selectedInitiative.businessNeed
            ?? 'Aprimorar a eficiência operacional da unidade com ações de captura de ganhos e padronização do processo.'}
        </p>
      </section>

      <section className="summary-section">
        <h4>Observações</h4>
        <p>
          {selectedInitiative.proposedSolution
            ?? `Iniciativa em ${selectedInitiative.stage}. Acompanhamento semanal com o responsável para evolução do plano.`}
        </p>
      </section>
    </div>
  )
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
      <InitiativesCommandBar
        hasSelection={hasSelection}
        draftFilters={draftFilters}
        isFilterOpen={isFilterOpen}
        units={units}
        stages={stages}
        statuses={statuses}
        responsaveis={responsaveis}
        onRefresh={() => {
          void loadInitiatives()
          showToast('success', 'Iniciativas atualizadas com sucesso.')
        }}
        onCreateNewInitiative={onCreateNewInitiative}
        onOpenSelected={() => selectedInitiative && onStartFlow(selectedInitiative.id)}
        onDelete={() => setIsConfirmOpen(true)}
        onToggleFilter={() => {
          setDraftFilters(filters)
          setIsFilterOpen((state) => !state)
        }}
        onExport={() => showToast('info', 'Exportação iniciada.')}
        onDraftFilterChange={setDraftFilters}
        onClearFilters={() => {
          setDraftFilters(INITIAL_FILTERS)
          setFilters(INITIAL_FILTERS)
          setSelectedId(initiatives[0]?.id ?? null)
        }}
        onApplyFilters={() => {
          setFilters(draftFilters)
          setIsFilterOpen(false)
          showToast('info', 'Filtro aplicado.')
        }}
      />

      <section className="initiatives-content-grid">
        <article className="initiatives-card initiatives-list-card">
          <InitiativesTableSection
            loading={loading}
            error={error}
            initiatives={filteredInitiatives}
            selectedInitiative={selectedInitiative}
            onSelect={setSelectedId}
            getStatusTone={getStatusTone}
          />

          <footer className="initiatives-list-footer">
            <span>Itens carregados: {filteredInitiatives.length}</span>
            <button type="button" className="btn compact secondary">Carregar mais</button>
          </footer>
        </article>

        <aside className="initiatives-card initiatives-summary-card">
          <InitiativesSummarySection selectedInitiative={selectedInitiative} getStatusTone={getStatusTone} />
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
