import { Card } from '../../../components/ui/Card'
import { StateMessage } from '../../../components/ui/StateMessage'
import { tokens } from '../../../components/ui/tokens'
import type { InitiativeListItem } from './InitiativesTableSection'
import { InitiativeMetricsPanel } from './InitiativeMetricsPanel'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'

type InitiativeSummarySectionProps = {
  item: InitiativeListItem | undefined
}

export function InitiativeSummarySection({ item }: InitiativeSummarySectionProps) {
  if (!item) {
    return <StateMessage title="No initiative selected" description="Select one item to view its summary." />
  }

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.sm }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{item.title}</h2>
            <p style={{ margin: '6px 0 0', color: tokens.colors.textSecondary, fontSize: 14 }}>
              Owner: {item.owner}
            </p>
          </div>
          <InitiativeStatusBadge status={item.status} />
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: tokens.colors.textSecondary }}>
          Stage: <strong style={{ color: tokens.colors.textPrimary }}>{item.stage}</strong>
        </p>
      </Card>

      <InitiativeMetricsPanel
        annualGain={item.annualGain}
        implementationCost={Math.round(item.annualGain * 0.34)}
        componentsCount={Math.max(2, Math.round(item.annualGain / 150000))}
      />
    </div>
  )
}
