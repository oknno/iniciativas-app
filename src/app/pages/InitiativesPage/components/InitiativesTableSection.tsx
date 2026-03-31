import { Card } from '../../../components/ui/Card'
import { StateMessage } from '../../../components/ui/StateMessage'
import { tokens } from '../../../components/ui/tokens'
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

export function InitiativesTableSection({ items, selectedId, onSelect }: InitiativesTableSectionProps) {
  if (items.length === 0) {
    return <StateMessage title="No initiatives available" description="Use New Initiative to create your first CAPEX initiative." />
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: tokens.spacing.xs,
          fontSize: 12,
          color: tokens.colors.textSecondary,
          padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`,
          borderBottom: `1px solid ${tokens.colors.borderStrong}`,
          background: tokens.colors.surfaceMuted,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.3,
        }}
      >
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
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: tokens.spacing.xs,
              width: '100%',
              border: 'none',
              borderBottom: `1px solid ${tokens.colors.border}`,
              padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`,
              textAlign: 'left',
              background: isSelected ? '#dbeafe' : tokens.colors.surface,
              cursor: 'pointer',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: tokens.colors.textPrimary,
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.title}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 500, color: tokens.colors.textMuted }}>{toStageLabel(item.stage)}</p>
            </div>
            <span style={{ fontSize: 13, color: tokens.colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.responsavel}
            </span>
            <InitiativeStatusBadge status={item.status} />
            <span style={{ fontSize: 13, color: tokens.colors.textSecondary, textAlign: 'right' }}>
              {compactCurrency.format(item.annualGain)}
            </span>
          </button>
        )
      })}
    </Card>
  )
}
