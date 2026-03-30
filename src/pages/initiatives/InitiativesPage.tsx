import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Field, Section, StateMessage } from '../../components/ui/system'
import { uiTokens } from '../../components/ui/uiTokens'
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

function FilterControl({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${uiTokens.colors.borderDefault}`,
        borderRadius: uiTokens.radius.control,
        background: uiTokens.colors.surface,
        padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`,
      }}
    >
      {children}
    </div>
  )
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
  const compactButtonStyle = {
    minHeight: '28px',
    padding: `5px ${uiTokens.spacing.md}`,
    fontSize: uiTokens.typography.xs,
  } as const

  const dividerStyle = {
    width: '1px',
    height: '16px',
    margin: `0 ${uiTokens.spacing.sm}`,
    background: uiTokens.colors.borderDefault,
  } as const

  return (
    <header
      aria-label="Barra de ações da tela inicial"
      data-filter-container
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '34px',
        padding: `${uiTokens.spacing.xs} ${uiTokens.spacing.lg}`,
        borderBottom: `1px solid ${uiTokens.colors.borderDefault}`,
        borderRadius: uiTokens.radius.card,
        background: uiTokens.colors.surface,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: uiTokens.spacing.xs }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: uiTokens.spacing.xs }}>
          <Button onClick={onRefresh} style={compactButtonStyle}>Atualizar</Button>
          <Button tone="primary" onClick={onCreateNewInitiative} style={compactButtonStyle}>Nova</Button>
        </div>

        <span aria-hidden="true" style={dividerStyle} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: uiTokens.spacing.xs }}>
          <Button onClick={onOpenSelected} disabled={!hasSelection} style={compactButtonStyle}>Visualizar</Button>
          <Button disabled={!hasSelection} style={compactButtonStyle}>Editar</Button>
          <Button disabled={!hasSelection} onClick={onDelete} style={compactButtonStyle}>Excluir</Button>
        </div>

        <span aria-hidden="true" style={dividerStyle} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: uiTokens.spacing.xs }}>
          <Button disabled={!hasSelection} style={compactButtonStyle}>Enviar</Button>
          <Button disabled={!hasSelection} style={compactButtonStyle}>Voltar</Button>
        </div>

        <span aria-hidden="true" style={dividerStyle} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: uiTokens.spacing.xs }}>
          <Button onClick={onToggleFilter} style={compactButtonStyle}>Filtro</Button>
          <Button onClick={onExport} style={compactButtonStyle}>Exportar</Button>
        </div>

        {isFilterOpen && (
          <Card
            style={{
              position: 'absolute',
              top: `calc(100% + ${uiTokens.spacing.sm})`,
              left: 0,
              width: 'min(420px, 90vw)',
              maxHeight: '60vh',
              overflowY: 'auto',
              zIndex: 20,
              padding: uiTokens.spacing.xl,
              boxShadow: `0 8px 24px ${uiTokens.colors.shadow}`,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: uiTokens.spacing.md }}>
              <Field label="Unidade">
                <FilterControl>
                  <select
                    style={{ width: '100%', border: 0, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textStrong, background: 'transparent' }}
                    value={draftFilters.unidade}
                    onChange={(event) => onDraftFilterChange({ ...draftFilters, unidade: event.target.value })}
                  >
                    <option value="">Todas</option>
                    {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </FilterControl>
              </Field>

              <Field label="Stage">
                <FilterControl>
                  <select
                    style={{ width: '100%', border: 0, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textStrong, background: 'transparent' }}
                    value={draftFilters.stage}
                    onChange={(event) => onDraftFilterChange({ ...draftFilters, stage: event.target.value })}
                  >
                    <option value="">Todos</option>
                    {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                  </select>
                </FilterControl>
              </Field>

              <Field label="Status">
                <FilterControl>
                  <select
                    style={{ width: '100%', border: 0, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textStrong, background: 'transparent' }}
                    value={draftFilters.status}
                    onChange={(event) => onDraftFilterChange({ ...draftFilters, status: event.target.value })}
                  >
                    <option value="">Todos</option>
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </FilterControl>
              </Field>

              <Field label="Responsável">
                <FilterControl>
                  <select
                    style={{ width: '100%', border: 0, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textStrong, background: 'transparent' }}
                    value={draftFilters.responsavel}
                    onChange={(event) => onDraftFilterChange({ ...draftFilters, responsavel: event.target.value })}
                  >
                    <option value="">Todos</option>
                    {responsaveis.map((responsavel) => <option key={responsavel} value={responsavel}>{responsavel}</option>)}
                  </select>
                </FilterControl>
              </Field>

              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Título">
                  <FilterControl>
                    <input
                      style={{ width: '100%', border: 0, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textStrong, background: 'transparent' }}
                      type="text"
                      value={draftFilters.title}
                      onChange={(event) => onDraftFilterChange({ ...draftFilters, title: event.target.value })}
                      placeholder="Buscar por título"
                    />
                  </FilterControl>
                </Field>
              </div>
            </div>

            <div style={{ marginTop: uiTokens.spacing.lg, display: 'flex', justifyContent: 'flex-end', gap: uiTokens.spacing.sm }}>
              <Button onClick={onClearFilters}>Limpar</Button>
              <Button tone="primary" onClick={onApplyFilters}>Aplicar filtros</Button>
            </div>
          </Card>
        )}
      </div>

      <h1 style={{ margin: 0, fontSize: uiTokens.typography.title, fontWeight: uiTokens.typography.titleWeight, color: uiTokens.colors.textStrong }}>Motor de Ganhos</h1>
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
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  if (loading) return <StateMessage state="loading" />
  if (error) return <StateMessage state="error" />
  if (initiatives.length === 0) return <StateMessage state="empty" />

  return (
    <div role="table" aria-label="Tabela de iniciativas" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1, overflow: 'hidden', background: uiTokens.colors.subtleSurface }}>
      <div role="rowgroup" style={{ borderBottom: `1px solid ${uiTokens.colors.borderDefault}`, background: uiTokens.colors.subtleSurface }}>
        <div role="row" style={{ display: 'grid', gridTemplateColumns: '88px minmax(280px, 2.6fr) minmax(120px, 1.1fr) 108px 120px', alignItems: 'center' }}>
          {['ID', 'Título', 'Unidade', 'Stage', 'Status'].map((header) => (
            <div key={header} role="columnheader" style={{ padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`, fontSize: uiTokens.typography.sm, fontWeight: 700, color: uiTokens.colors.textStrong }}>{header}</div>
          ))}
        </div>
      </div>

      <div role="rowgroup" style={{ flex: 1, minHeight: 0, maxHeight: '510px', overflow: 'auto', background: uiTokens.colors.surface }}>
        {initiatives.map((initiative) => {
          const isSelected = initiative.id === selectedInitiative?.id
          const isHovered = hoveredId === initiative.id
          return (
            <button
              key={initiative.id}
              type="button"
              role="row"
              onClick={() => onSelect(initiative.id)}
              onMouseEnter={() => setHoveredId(initiative.id)}
              onMouseLeave={() => setHoveredId((current) => (current === initiative.id ? null : current))}
              style={{
                width: '100%',
                border: 0,
                borderBottom: `1px solid ${uiTokens.colors.borderSoft}`,
                background: isSelected ? uiTokens.colors.selectedSurface : isHovered ? uiTokens.colors.hoverSurface : uiTokens.colors.surface,
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '88px minmax(280px, 2.6fr) minmax(120px, 1.1fr) 108px 120px',
                alignItems: 'center',
              }}
            >
              <span role="cell" style={{ display: 'block', padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textBody }}>MG-{String(initiative.id).padStart(3, '0')}</span>
              <span role="cell" title={initiative.title} style={{ display: 'block', padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textBody, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{initiative.title}</span>
              <span role="cell" style={{ display: 'block', padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textBody }}>{initiative.unidade}</span>
              <span role="cell" style={{ display: 'block', padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textBody }}>{initiative.stage}</span>
              <span role="cell" style={{ display: 'block', padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`, fontSize: uiTokens.typography.sm, color: uiTokens.colors.textBody }}>
                <Badge tone={getStatusTone(initiative.status)}>{initiative.status}</Badge>
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

function CompactStatusBadge({ tone, label }: { tone: 'neutral' | 'info' | 'success' | 'warning' | 'error', label: string }) {
  const toneStyle: Record<'neutral' | 'info' | 'success' | 'warning' | 'error', { background: string, color: string, borderColor: string }> = {
    neutral: { background: uiTokens.colors.neutralBadgeBg, color: uiTokens.colors.neutralBadgeText, borderColor: uiTokens.colors.borderDefault },
    info: { background: uiTokens.colors.infoBadgeBg, color: uiTokens.colors.infoBadgeText, borderColor: uiTokens.colors.infoBadgeBorder },
    success: { background: uiTokens.colors.successBadgeBg, color: uiTokens.colors.successBadgeText, borderColor: uiTokens.colors.successBadgeBorder },
    warning: { background: uiTokens.colors.warningBadgeBg, color: uiTokens.colors.warningBadgeText, borderColor: uiTokens.colors.warningBadgeBorder },
    error: { background: uiTokens.colors.errorBadgeBg, color: uiTokens.colors.errorBadgeText, borderColor: uiTokens.colors.errorBadgeBorder },
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: `2px ${uiTokens.spacing.xs}`, borderRadius: uiTokens.radius.pill, border: `1px solid ${toneStyle[tone].borderColor}`, background: toneStyle[tone].background, color: toneStyle[tone].color, fontSize: uiTokens.typography.xs, fontWeight: uiTokens.typography.titleWeight, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function InitiativesSummarySection({ selectedInitiative, getStatusTone }: InitiativesSummarySectionProps) {
  if (!selectedInitiative) {
    return <StateMessage state="empty" />
  }

  return (
    <Section title="Resumo">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: uiTokens.spacing.sm }}>
        <h3 style={{ margin: 0, fontSize: uiTokens.typography.title, fontWeight: 800, color: uiTokens.colors.textStrong }}>{selectedInitiative.title}</h3>
        <CompactStatusBadge tone={getStatusTone(selectedInitiative.status)} label={selectedInitiative.status} />
      </div>

      <div style={{ height: '1px', background: uiTokens.colors.borderDefault }} />

      <div style={{ display: 'grid', gap: uiTokens.spacing.xs }}>
        <Field inline label="Código / ID" value={`MG-${String(selectedInitiative.id).padStart(3, '0')}`} />
        <Field inline label="Unidade" value={selectedInitiative.unidade} />
        <Field inline label="Stage" value={selectedInitiative.stage} />
        <Field inline label="Status" value={selectedInitiative.status} />
        <Field inline label="Componentes" value={selectedInitiative.componentsCount ?? 0} />
        <Field inline label="Total estimado" value={formatCurrency(selectedInitiative.estimatedTotal ?? selectedInitiative.budget ?? 0)} />
        <Field inline label="Ganho acumulado" value={formatCurrency(selectedInitiative.accumulatedGain ?? 0)} />
      </div>

      <div style={{ height: '1px', background: uiTokens.colors.borderDefault }} />

      <Section title="Objetivo">
        <p style={{ margin: 0, color: uiTokens.colors.textBody, fontSize: uiTokens.typography.md, lineHeight: 1.5 }}>
          {selectedInitiative.businessNeed
            ?? 'Aprimorar a eficiência operacional da unidade com ações de captura de ganhos e padronização do processo.'}
        </p>
      </Section>

      <Section title="Observações">
        <p style={{ margin: 0, color: uiTokens.colors.textBody, fontSize: uiTokens.typography.md, lineHeight: 1.5 }}>
          {selectedInitiative.proposedSolution
            ?? `Iniciativa em ${selectedInitiative.stage}. Acompanhamento semanal com o responsável para evolução do plano.`}
        </p>
      </Section>
    </Section>
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
    <main style={{ display: 'flex', flexDirection: 'column', gap: uiTokens.spacing.xs, color: uiTokens.colors.textBody, background: uiTokens.colors.pageBg }}>
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

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(330px, 0.95fr)', gap: uiTokens.spacing.xs, alignItems: 'start' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: uiTokens.spacing.xs, minHeight: '540px', padding: `${uiTokens.spacing.xs} ${uiTokens.spacing.sm}` }}>
          <div style={{ border: `1px solid ${uiTokens.colors.borderDefault}`, borderRadius: uiTokens.radius.control, overflow: 'hidden' }}>
            <InitiativesTableSection
              loading={loading}
              error={error}
              initiatives={filteredInitiatives}
              selectedInitiative={selectedInitiative}
              onSelect={setSelectedId}
              getStatusTone={getStatusTone}
            />
          </div>

          <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '34px', color: uiTokens.colors.textMuted, fontSize: uiTokens.typography.xs, padding: `0 ${uiTokens.spacing.xxs}`, borderTop: `1px solid ${uiTokens.colors.borderSoft}` }}>
            <span>Itens carregados: {filteredInitiatives.length}</span>
            <Button>Carregar mais</Button>
          </footer>
        </Card>

        <Card style={{ padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}` }}>
          <InitiativesSummarySection selectedInitiative={selectedInitiative} getStatusTone={getStatusTone} />
        </Card>
      </section>

      {isConfirmOpen && selectedInitiative && (
        <div role="presentation" onClick={() => setIsConfirmOpen(false)} style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: uiTokens.colors.overlay, zIndex: 30, padding: uiTokens.spacing.xxl }}>
          <Card style={{ width: 'min(460px, 92vw)', borderRadius: uiTokens.radius.modal, boxShadow: `0 10px 30px ${uiTokens.colors.shadow}`, padding: uiTokens.spacing.xxl }}>
            <h3 style={{ margin: `0 0 ${uiTokens.spacing.sm}`, fontSize: uiTokens.typography.title, fontWeight: uiTokens.typography.titleWeight, color: uiTokens.colors.textStrong }}>Confirmar exclusão</h3>
            <p style={{ margin: 0, color: uiTokens.colors.textBody, fontSize: uiTokens.typography.md }}>
              Deseja excluir a iniciativa <strong>{selectedInitiative.title}</strong>?
            </p>
            <div style={{ marginTop: uiTokens.spacing.xxl, display: 'flex', justifyContent: 'flex-end', gap: uiTokens.spacing.sm }} onClick={(event) => event.stopPropagation()}>
              <Button onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
              <Button tone="danger" onClick={() => void handleDelete()}>Confirmar exclusão</Button>
            </div>
          </Card>
        </div>
      )}

      <div role="status" aria-live="polite" style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: 40, display: 'flex', flexDirection: 'column', gap: uiTokens.spacing.sm }}>
        {toasts.map((toast) => (
          <Card key={toast.id} style={{ padding: `${uiTokens.spacing.sm} ${uiTokens.spacing.md}`, boxShadow: `0 8px 24px ${uiTokens.colors.shadow}` }}>
            <Badge tone={toast.type === 'success' ? 'success' : toast.type === 'error' ? 'error' : 'info'}>{toast.message}</Badge>
          </Card>
        ))}
      </div>
    </main>
  )
}
