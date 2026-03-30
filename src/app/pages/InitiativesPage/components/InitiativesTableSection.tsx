import { Card } from '../../../components/ui/Card'
import { tokens } from '../../../components/ui/tokens'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'

type InitiativeStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected'

export type InitiativeListItem = {
  id: string
  title: string
  owner: string
  stage: string
  status: InitiativeStatus
  annualGain: number
}

type InitiativesTableSectionProps = {
  items: InitiativeListItem[]
  selectedId: string
  onSelect: (id: string) => void
}

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

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
              <p style={{ margin: '2px 0 0', fontSize: 12, color: tokens.colors.textMuted }}>{item.stage}</p>
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
