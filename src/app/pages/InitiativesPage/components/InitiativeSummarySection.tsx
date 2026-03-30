import { Card } from '../../../components/ui/Card'
import { StateMessage } from '../../../components/ui/StateMessage'
import { tokens } from '../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import { InitiativeMetricsPanel } from './InitiativeMetricsPanel'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'

type InitiativeSummarySectionProps = {
  item: InitiativeDetailDto | undefined
}

const stageLabel: Record<InitiativeDetailDto['stage'], string> = {
  DRAFTING: 'Drafting',
  ASSESSMENT: 'Assessment',
  VALIDATION: 'Validation',
  GOVERNANCE_GATE: 'Governance Gate',
}

const scenarioLabel: Record<InitiativeDetailDto['scenario'], string> = {
  BASE: 'Base',
  BEST: 'Best',
  WORST: 'Worst',
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
              Code: {item.code} • Responsible: {item.owner}
            </p>
          </div>
          <InitiativeStatusBadge status={item.status} />
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: tokens.colors.textSecondary }}>
          Stage: <strong style={{ color: tokens.colors.textPrimary }}>{stageLabel[item.stage]}</strong>
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: tokens.colors.textSecondary }}>
          Scenario: <strong style={{ color: tokens.colors.textPrimary }}>{scenarioLabel[item.scenario]}</strong>
        </p>
        {item.description ? (
          <p style={{ margin: '8px 0 0', fontSize: 14, color: tokens.colors.textSecondary }}>{item.description}</p>
        ) : null}
      </Card>

      <InitiativeMetricsPanel
        annualGain={item.annualGain}
        implementationCost={item.implementationCost}
        componentsCount={item.components.length}
        stage={item.stage}
        status={item.status}
      />
    </div>
  )
}
