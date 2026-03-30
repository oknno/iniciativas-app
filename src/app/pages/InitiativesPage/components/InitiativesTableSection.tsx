import { Card } from '../../../components/ui/Card'
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

const stageLabel: Record<InitiativeListItemDto['stage'], string> = {
  DRAFTING: 'Drafting',
  ASSESSMENT: 'Assessment',
  VALIDATION: 'Validation',
  GOVERNANCE_GATE: 'Governance Gate',
}

export function InitiativesTableSection({ items, selectedId, onSelect }: InitiativesTableSectionProps) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: tokens.spacing.sm,
          fontSize: 12,
          color: tokens.colors.textMuted,
          padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
          borderBottom: `1px solid ${tokens.colors.border}`,
          background: '#f8fafc',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.3,
        }}
      >
        <span>Initiative</span>
        <span>Owner</span>
        <span>Status</span>
        <span>Annual Gain</span>
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
              gap: tokens.spacing.sm,
              width: '100%',
              border: 'none',
              borderBottom: `1px solid ${tokens.colors.border}`,
              padding: `${tokens.spacing.md}px`,
              textAlign: 'left',
              background: isSelected ? tokens.colors.accentSoft : '#ffffff',
              cursor: 'pointer',
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: tokens.colors.textPrimary }}>
                {item.title}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: tokens.colors.textMuted }}>{stageLabel[item.stage]}</p>
            </div>
            <span style={{ fontSize: 13, color: tokens.colors.textSecondary }}>{item.owner}</span>
            <InitiativeStatusBadge status={item.status} />
            <span style={{ fontSize: 13, color: tokens.colors.textSecondary }}>
              {compactCurrency.format(item.annualGain)}
            </span>
          </button>
        )
      })}
    </Card>
  )
}
