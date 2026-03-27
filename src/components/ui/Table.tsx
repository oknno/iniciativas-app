import { Badge } from './Badge'

type ProjectStatus = 'Rascunho' | 'Em revisão' | 'Aprovado' | 'Bloqueado'

export type ProjectRow = {
  id: number
  title: string
  unit: string
  status: ProjectStatus
}

type TableProps = {
  items: ProjectRow[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const statusToneMap: Record<ProjectStatus, 'neutral' | 'info' | 'success' | 'warning'> = {
  Rascunho: 'neutral',
  'Em revisão': 'info',
  Aprovado: 'success',
  Bloqueado: 'warning',
}

export function Table({ items, selectedId, onSelect }: TableProps) {
  return (
    <div className="ui-table" role="table" aria-label="Tabela de projetos">
      <div className="ui-table__head" role="rowgroup">
        <span>ID</span>
        <span>Título</span>
        <span>Unidade</span>
        <span>Status</span>
      </div>
      <div role="rowgroup">
        {items.map((item) => (
          <button
            key={item.id}
            className={`ui-table__row ${selectedId === item.id ? 'is-selected' : ''}`}
            onClick={() => onSelect(item.id)}
            role="row"
            type="button"
          >
            <span title={String(item.id)}>{item.id}</span>
            <span title={item.title}>{item.title}</span>
            <span title={item.unit}>{item.unit}</span>
            <span>
              <Badge label={item.status} tone={statusToneMap[item.status]} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
