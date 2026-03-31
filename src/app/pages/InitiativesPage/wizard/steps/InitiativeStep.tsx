import { Card } from '../../../../components/ui/Card'
import { tokens } from '../../../../components/ui/tokens'

type InitiativeStepForm = {
  title: string
  unidade: string
  responsavel: string
  stage: string
  status: string
}

type InitiativeStepProps = {
  form: InitiativeStepForm
  onTitleChange: (value: string) => void
  onUnidadeChange: (value: string) => void
  onResponsavelChange: (value: string) => void
  onStageChange: (value: string) => void
  onStatusChange: (value: string) => void
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

export function InitiativeStep({ form, onTitleChange, onUnidadeChange, onResponsavelChange, onStageChange, onStatusChange }: InitiativeStepProps) {
  return (
    <Card>
      <h3 style={{ margin: 0, fontSize: 17, color: tokens.colors.textPrimary }}>Initiative details</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.md }}>
        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Title
          <input style={inputStyle} value={form.title} onChange={(event) => onTitleChange(event.target.value)} placeholder="Initiative title" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Unidade
          <input style={inputStyle} value={form.unidade} onChange={(event) => onUnidadeChange(event.target.value)} placeholder="Plant/Unit" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Responsible
          <input style={inputStyle} value={form.responsavel} onChange={(event) => onResponsavelChange(event.target.value)} placeholder="Responsible name" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Stage
          <input style={inputStyle} value={form.stage} onChange={(event) => onStageChange(event.target.value)} placeholder="Stage" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: tokens.colors.textSecondary }}>
          Status
          <input style={inputStyle} value={form.status} onChange={(event) => onStatusChange(event.target.value)} placeholder="Status" />
        </label>
      </div>
    </Card>
  )
}
