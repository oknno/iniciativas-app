import { Card } from '../../../components/ui/Card'
import { Field } from '../../../components/ui/Field'
import { StateMessage } from '../../../components/ui/StateMessage'
import { uiTokens } from '../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'

type InitiativeSummarySectionProps = {
  item: InitiativeDetailDto | undefined
}

const sectionDivider = {
  borderTop: `1px solid ${uiTokens.colors.border}`,
  paddingTop: uiTokens.spacing.md,
}

export function InitiativeSummarySection({ item }: InitiativeSummarySectionProps) {
  if (!item) {
    return <StateMessage title="No initiative selected" description="Select one item to view its summary." />
  }

  return (
    <Card>
      <div style={{ display: 'grid', gap: uiTokens.spacing.md }}>
        <h3 style={{ margin: 0, ...uiTokens.typography.subtitle, color: uiTokens.colors.textPrimary }}>Resumo</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: uiTokens.spacing.sm }}>
          <h4 style={{ margin: 0, ...uiTokens.typography.body, color: uiTokens.colors.textPrimary }}>{item.title}</h4>
          <InitiativeStatusBadge status={item.status} />
        </div>

        <p style={{ margin: 0, ...uiTokens.typography.caption, color: uiTokens.colors.textSecondary }}>
          codigoSAP: Pendente
        </p>

        <div style={{ ...sectionDivider, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: uiTokens.spacing.sm }}>
          <Field label="ID" value={item.id} />
          <Field label="Unidade" value={item.unidade || '-'} />
          <Field label="Responsável" value={item.responsavel || '-'} />
          <Field label="Stage" value={item.stage || '-'} />
        </div>

        <div style={sectionDivider}>
          <Field label="Business Need" value="-" />
        </div>

        <div style={sectionDivider}>
          <Field label="Proposed Solution" value="-" />
        </div>
      </div>
    </Card>
  )
}
