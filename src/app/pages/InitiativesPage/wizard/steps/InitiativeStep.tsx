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

const labelStyle = {
  display: 'grid',
  gap: 4,
  fontSize: 13,
  fontWeight: 600,
  color: tokens.colors.textSecondary,
} as const

export function InitiativeStep({ form, onTitleChange, onUnidadeChange, onResponsavelChange, onStageChange, onStatusChange }: InitiativeStepProps) {
  return (
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      <Card style={{ background: '#f7f9fc', borderColor: tokens.colors.borderStrong }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: tokens.colors.textPrimary }}>1. Sobre o Projeto</h3>
        <div style={{ marginTop: tokens.spacing.sm, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.sm, padding: tokens.spacing.sm, background: tokens.colors.surface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.sm }}>
            <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
              Título da Iniciativa
              <input style={inputStyle} value={form.title} onChange={(event) => onTitleChange(event.target.value)} placeholder="Initiative title" />
            </label>

            <label style={labelStyle}>
              Unidade
              <input style={inputStyle} value={form.unidade} onChange={(event) => onUnidadeChange(event.target.value)} placeholder="Plant/Unit" />
            </label>

            <label style={labelStyle}>
              Responsável
              <input style={inputStyle} value={form.responsavel} onChange={(event) => onResponsavelChange(event.target.value)} placeholder="Responsible name" />
            </label>
          </div>
        </div>
      </Card>

      <Card style={{ background: '#f7f9fc', borderColor: tokens.colors.borderStrong }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: tokens.colors.textPrimary }}>2. Origem e Programa</h3>
        <div style={{ marginTop: tokens.spacing.sm, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.sm, padding: tokens.spacing.sm, background: tokens.colors.surface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.sm }}>
            <label style={labelStyle}>
              Stage
              <input style={inputStyle} value={form.stage} onChange={(event) => onStageChange(event.target.value)} placeholder="Stage" />
            </label>

            <label style={labelStyle}>
              Status
              <input style={inputStyle} value={form.status} onChange={(event) => onStatusChange(event.target.value)} placeholder="Status" />
            </label>
          </div>
        </div>
      </Card>
    </div>
  )
}
