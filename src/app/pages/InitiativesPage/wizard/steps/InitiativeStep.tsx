import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'
import type { InitiativeStage } from '../../../../../domain/initiatives/entities/InitiativeStage'
import type { InitiativeStatus } from '../../../../../domain/initiatives/entities/InitiativeStatus'

type InitiativeStepForm = {
  title: string
  owner: string
  stage: InitiativeStage
  status: InitiativeStatus
}

type InitiativeStepProps = {
  form: InitiativeStepForm
  onTitleChange: (value: string) => void
  onOwnerChange: (value: string) => void
  onStageChange: (value: InitiativeStage) => void
  onStatusChange: (value: InitiativeStatus) => void
}

const inputStyle = {
  width: '100%',
  border: `1px solid ${tokens.colors.borderStrong}`,
  borderRadius: tokens.radius.sm,
  fontSize: 14,
  color: tokens.colors.textPrimary,
  padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
  background: '#ffffff',
} as const

export function InitiativeStep({ form, onTitleChange, onOwnerChange, onStageChange, onStatusChange }: InitiativeStepProps) {
  return (
    <Card>
      <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Initiative details</h3>
      <p style={{ margin: `${tokens.spacing.xs}px 0 ${tokens.spacing.md}px`, fontSize: 14, color: tokens.colors.textSecondary }}>
        Complete the core profile data for this initiative.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.md }}>
        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Title
          <input style={inputStyle} value={form.title} onChange={(event) => onTitleChange(event.target.value)} placeholder="Initiative title" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Responsible
          <input style={inputStyle} value={form.owner} onChange={(event) => onOwnerChange(event.target.value)} placeholder="Owner name" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Stage
          <select style={inputStyle} value={form.stage} onChange={(event) => onStageChange(event.target.value as InitiativeStage)}>
            <option value="DRAFTING">Drafting</option>
            <option value="ASSESSMENT">Assessment</option>
            <option value="VALIDATION">Validation</option>
            <option value="GOVERNANCE_GATE">Governance Gate</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Status
          <select style={inputStyle} value={form.status} onChange={(event) => onStatusChange(event.target.value as InitiativeStatus)}>
            <option value="DRAFT">Draft</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
      </div>
    </Card>
  )
}
