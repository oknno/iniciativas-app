import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { Button } from '../../components/ui/Button'
import { uiTokens } from '../../components/ui/tokens'

type CommandBarFilters = {
  searchTitle: string
  status: string
  unit: string
  sortBy: 'Title' | 'Id' | 'approvalYear'
  sortDir: 'asc' | 'desc'
}

type CommandBarProps = {
  selectedId: InitiativeId | null
  selectedStatus: string
  totalLoaded: number
  filters: CommandBarFilters
  onChangeFilters: (nextFilters: CommandBarFilters) => void
  onApply: () => void
  onClear: () => void
  onRefresh: () => void
  onNew: () => void
  onView: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  onSendToApproval: () => void
  onBackStatus: () => void
  onExport: () => void
}

const statusOptions = ['Rascunho', 'Em Aprovação', 'Aprovado', 'Reprovado'] as const
const sortByOptions = ['Title', 'Id', 'approvalYear'] as const
const sortDirOptions = ['asc', 'desc'] as const

const styles: Record<string, CSSProperties> = {
  root: {
    position: 'sticky',
    top: 0,
    zIndex: uiTokens.zIndex.sticky,
    background: uiTokens.colors.surface,
    borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: uiTokens.spacing.md,
    padding: '8px 12px',
  },
  title: {
    margin: 0,
    ...uiTokens.typography.body,
    fontWeight: 700,
    color: uiTokens.colors.textPrimary,
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 0,
    flexWrap: 'wrap',
    position: 'relative',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  commandButton: {
    fontSize: 13,
    lineHeight: '16px',
    padding: '6px 10px',
    borderRadius: 10,
  },
  divider: {
    width: 1,
    height: 20,
    background: '#e5e7eb',
    margin: '0 8px',
  },
  filterWrapper: {
    position: 'relative',
  },
  filterDialog: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: 320,
    background: uiTokens.colors.surface,
    border: `1px solid ${uiTokens.colors.borderStrong}`,
    borderRadius: uiTokens.radius.md,
    boxShadow: uiTokens.shadow.md,
    padding: uiTokens.spacing.md,
    zIndex: uiTokens.zIndex.sticky + 1,
  },
  fieldGroup: {
    display: 'grid',
    gap: uiTokens.spacing.xs,
    marginBottom: uiTokens.spacing.sm,
  },
  label: {
    ...uiTokens.typography.caption,
    color: uiTokens.colors.textSecondary,
  },
  input: {
    height: 30,
    borderRadius: uiTokens.radius.sm,
    border: `1px solid ${uiTokens.colors.borderStrong}`,
    padding: `0 ${uiTokens.spacing.xs}px`,
    ...uiTokens.typography.caption,
    color: uiTokens.colors.textPrimary,
    width: '100%',
    boxSizing: 'border-box',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: uiTokens.spacing.xs,
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: uiTokens.spacing.xs,
    marginTop: uiTokens.spacing.sm,
  },
}

const normalizeStatus = (value: string): string => value.trim().toLowerCase()

export function CommandBar({
  selectedId,
  selectedStatus,
  totalLoaded,
  filters,
  onChangeFilters,
  onApply,
  onClear,
  onRefresh,
  onNew,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onSendToApproval,
  onBackStatus,
  onExport,
}: CommandBarProps) {
  void totalLoaded

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const filterRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isFilterOpen) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!filterRef.current) {
        return
      }

      const target = event.target
      if (target instanceof Node && !filterRef.current.contains(target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [isFilterOpen])

  const status = normalizeStatus(selectedStatus)

  const actionAvailability = useMemo(() => {
    const hasSelection = selectedId !== null
    const editableStatus = status.length === 0 || status === 'rascunho'

    return {
      canView: hasSelection,
      canDuplicate: hasSelection,
      canEdit: hasSelection && editableStatus,
      canDelete: hasSelection && editableStatus,
      canBackStatus: status !== 'aprovado',
    }
  }, [selectedId, status])

  const handleFilterField = <K extends keyof CommandBarFilters>(key: K, value: CommandBarFilters[K]) => {
    onChangeFilters({ ...filters, [key]: value })
  }

  const handleApply = () => {
    onApply()
    setIsFilterOpen(false)
  }

  const handleClear = () => {
    onClear()
    setIsFilterOpen(false)
  }

  return (
    <div style={styles.root}>
      <div className="initiatives-container">
        <div style={styles.content}>
          <h1 style={styles.title}>Initiatives Engine</h1>

          <div style={styles.rightSide}>
            <div style={styles.buttonGroup}>
              <Button style={styles.commandButton} onClick={onRefresh}>
                Atualizar
              </Button>
              <Button tone="primary" style={styles.commandButton} onClick={onNew}>
                Novo
              </Button>
            </div>
            <span style={styles.divider} />

            <div style={styles.buttonGroup}>
              <Button style={styles.commandButton} onClick={onView} disabled={!actionAvailability.canView}>
                Visualizar
              </Button>
              <Button style={styles.commandButton} onClick={onEdit} disabled={!actionAvailability.canEdit}>
                Editar
              </Button>
              <Button style={styles.commandButton} onClick={onDuplicate} disabled={!actionAvailability.canDuplicate}>
                Duplicar
              </Button>
              <Button style={styles.commandButton} onClick={onDelete} disabled={!actionAvailability.canDelete}>
                Excluir
              </Button>
            </div>
            <span style={styles.divider} />

            <div style={styles.buttonGroup}>
              <Button style={styles.commandButton} onClick={onSendToApproval}>
                Enviar p/ Aprovação
              </Button>
              <Button style={styles.commandButton} onClick={onBackStatus} disabled={!actionAvailability.canBackStatus}>
                Voltar Status
              </Button>
            </div>
            <span style={styles.divider} />

            <div style={styles.buttonGroup}>
              <div style={styles.filterWrapper} ref={filterRef}>
                <Button style={styles.commandButton} onClick={() => setIsFilterOpen((current) => !current)}>
                  Filtro
                </Button>
                {isFilterOpen ? (
                  <div role="dialog" aria-label="Filtros da listagem" style={styles.filterDialog}>
                    <div style={styles.fieldGroup}>
                      <label htmlFor="filter-search-title" style={styles.label}>
                        Nome do projeto
                      </label>
                      <input
                        id="filter-search-title"
                        type="text"
                        value={filters.searchTitle}
                        onChange={(event) => handleFilterField('searchTitle', event.target.value)}
                        placeholder="contém..."
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.fieldGroup}>
                      <label htmlFor="filter-status" style={styles.label}>
                        Status
                      </label>
                      <select
                        id="filter-status"
                        value={filters.status}
                        onChange={(event) => handleFilterField('status', event.target.value)}
                        style={styles.input}
                      >
                        <option value="">Todos</option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label htmlFor="filter-unit" style={styles.label}>
                        Unidade
                      </label>
                      <input
                        id="filter-unit"
                        type="text"
                        value={filters.unit}
                        onChange={(event) => handleFilterField('unit', event.target.value)}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.fieldRow}>
                      <div style={styles.fieldGroup}>
                        <label htmlFor="filter-sort-by" style={styles.label}>
                          Ordenar por
                        </label>
                        <select
                          id="filter-sort-by"
                          value={filters.sortBy}
                          onChange={(event) => handleFilterField('sortBy', event.target.value as CommandBarFilters['sortBy'])}
                          style={styles.input}
                        >
                          {sortByOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.fieldGroup}>
                        <label htmlFor="filter-sort-dir" style={styles.label}>
                          Direção
                        </label>
                        <select
                          id="filter-sort-dir"
                          value={filters.sortDir}
                          onChange={(event) => handleFilterField('sortDir', event.target.value as CommandBarFilters['sortDir'])}
                          style={styles.input}
                        >
                          {sortDirOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={styles.dialogActions}>
                      <Button onClick={handleClear}>Limpar</Button>
                      <Button tone="primary" onClick={handleApply}>
                        Aplicar
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              <Button style={styles.commandButton} onClick={onExport}>
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export type { CommandBarFilters }
