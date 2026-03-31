import type { CSSProperties } from 'react'
import { Card } from '../../../components/ui/Card'
import { StateMessage } from '../../../components/ui/StateMessage'
import { uiTokens } from '../../../components/ui/tokens'
import type { InitiativeListItemDto } from '../../../../application/dto/initiatives/InitiativeListItemDto'
import type { InitiativeId } from '../../../../domain/initiatives/value-objects/InitiativeId'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'

type InitiativesTableSectionProps = {
  items: readonly InitiativeListItemDto[]
  selectedId?: InitiativeId
  onSelect: (id: InitiativeId) => void
}

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const toStageLabel = (stage: string): string => stage.replace(/_/g, ' ')

const styles: Record<string, CSSProperties> = {
  header: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: uiTokens.spacing.xs,
    ...uiTokens.typography.overline,
    color: uiTokens.colors.textSecondary,
    padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.lg}px`,
    borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
    background: uiTokens.colors.surfaceMuted,
    textTransform: 'uppercase',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: uiTokens.spacing.xs,
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${uiTokens.colors.border}`,
    padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.lg}px`,
    textAlign: 'left',
    cursor: 'pointer',
  },
}

export function InitiativesTableSection({ items, selectedId, onSelect }: InitiativesTableSectionProps) {
  if (items.length === 0) {
    return <StateMessage title="No initiatives available" description="Use New Initiative to create your first CAPEX initiative." />
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={styles.header}>
        <span>Initiative</span>
        <span>Responsible</span>
        <span>Status</span>
        <span style={{ textAlign: 'right' }}>Annual Gain</span>
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
            <div>
              <p
                style={{
                  margin: 0,
                  ...uiTokens.typography.body,
                  color: uiTokens.colors.textPrimary,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.title}
              </p>
              <p style={{ margin: '2px 0 0', ...uiTokens.typography.caption, color: uiTokens.colors.textMuted }}>{toStageLabel(item.stage)}</p>
            </div>
            <span style={{ ...uiTokens.typography.body, color: uiTokens.colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.responsavel}
            </span>
            <InitiativeStatusBadge status={item.status} />
            <span style={{ ...uiTokens.typography.body, color: uiTokens.colors.textSecondary, textAlign: 'right' }}>
              {compactCurrency.format(item.annualGain)}
            </span>
          </button>
        )
      })}
    </Card>
  )
}
