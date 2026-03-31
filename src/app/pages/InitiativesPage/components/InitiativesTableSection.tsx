import type { CSSProperties } from 'react'
import { Card } from '../../../components/ui/Card'
import { StateMessage } from '../../../components/ui/StateMessage'
import { uiTokens } from '../../../components/ui/tokens'
import type { InitiativeListItemDto } from '../../../../application/dto/initiatives/InitiativeListItemDto'
import type { InitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'

type InitiativesTableSectionProps = {
  items: readonly InitiativeListItemDto[]
  selectedId?: InitiativeId
  onSelect: (id: InitiativeId) => void
}

const styles: Record<string, CSSProperties> = {
  header: {
    display: 'grid',
    gridTemplateColumns: '100px 1.8fr 1fr 1fr',
    gap: uiTokens.spacing.xs,
    ...uiTokens.typography.overline,
    color: uiTokens.colors.textSecondary,
    padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.md}px`,
    borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
    background: uiTokens.colors.surfaceMuted,
    textTransform: 'uppercase',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '100px 1.8fr 1fr 1fr',
    gap: uiTokens.spacing.xs,
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${uiTokens.colors.border}`,
    padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.md}px`,
    textAlign: 'left',
    cursor: 'pointer',
    background: uiTokens.colors.surface,
  },
  cell: {
    ...uiTokens.typography.body,
    color: uiTokens.colors.textSecondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.md}px`,
    background: uiTokens.colors.surfaceMuted,
    borderTop: `1px solid ${uiTokens.colors.borderStrong}`,
    ...uiTokens.typography.caption,
    color: uiTokens.colors.textMuted,
  },
}

export function InitiativesTableSection({ items, selectedId, onSelect }: InitiativesTableSectionProps) {
  if (items.length === 0) {
    return <StateMessage title="No initiatives available" description="Use New Initiative to create your first CAPEX initiative." />
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={styles.header}>
        <span>ID</span>
        <span>Title</span>
        <span>Unidade</span>
        <span>Status</span>
      </div>

      {items.map((item) => {
        const isSelected = item.id === selectedId
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            style={{ ...styles.row, background: isSelected ? uiTokens.colors.accentSoft : uiTokens.colors.surface }}
          >
            <span style={styles.cell}>{item.id}</span>
            <span style={styles.cell}>{item.title}</span>
            <span style={styles.cell}>{item.unidade || '-'}</span>
            <span style={styles.cell}>{item.status || '-'}</span>
          </button>
        )
      })}

      <div style={styles.footer}>
        <span>Total</span>
        <span>{items.length}</span>
      </div>
    </Card>
  )
}
