import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'

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
    zIndex: 10,
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
  },
  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '20px',
    color: '#111827',
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
  divider: {
    width: 1,
    height: 26,
    background: '#e5e7eb',
    margin: '0 4px',
  },
  filterWrapper: {
    position: 'relative',
  },
  filterDialog: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: 420,
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,.10)',
    padding: 12,
    zIndex: 11,
  },
  fieldGroup: {
    display: 'grid',
    gap: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    lineHeight: '16px',
    color: '#6b7280',
  },
  input: {
    height: 30,
    borderRadius: 8,
    border: '1px solid #d1d5db',
    padding: '0 8px',
    fontSize: 12,
    lineHeight: '16px',
    color: '#111827',
    width: '100%',
    boxSizing: 'border-box',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 4,
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
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
          <h1 style={styles.title}>Termo de Abertura de Projeto - TAP 2.0</h1>

          <div style={styles.rightSide}>
            <div style={styles.buttonGroup}>
              <button type="button" className="btn" onClick={onRefresh}>
                Atualizar
              </button>
              <button type="button" className="btn primary" onClick={onNew}>
                Novo
              </button>
              <button type="button" className="btn" onClick={onView} disabled={!actionAvailability.canView}>
                Visualizar
              </button>
              <button type="button" className="btn" onClick={onEdit} disabled={!actionAvailability.canEdit}>
                Editar
              </button>
              <button type="button" className="btn" onClick={onDuplicate} disabled={!actionAvailability.canDuplicate}>
                Duplicar
              </button>
              <button type="button" className="btn" onClick={onDelete} disabled={!actionAvailability.canDelete}>
                Excluir
              </button>
            </div>
            <span style={styles.divider} />

            <div style={styles.buttonGroup}>
              <button type="button" className="btn" onClick={onSendToApproval}>
                Enviar p/ Aprovação
              </button>
              <button type="button" className="btn" onClick={onBackStatus} disabled={!actionAvailability.canBackStatus}>
                Voltar Status
              </button>
            </div>
            <span style={styles.divider} />

            <div style={styles.buttonGroup}>
              <div style={styles.filterWrapper} ref={filterRef}>
                <button type="button" className="btn" onClick={() => setIsFilterOpen((current) => !current)}>
                  Filtro
                </button>
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
                      <button type="button" className="btn" onClick={handleClear}>
                        Limpar
                      </button>
                      <button type="button" className="btn primary" onClick={handleApply}>
                        Aplicar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <button type="button" className="btn" onClick={onExport}>
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export type { CommandBarFilters }
