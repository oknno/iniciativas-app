import type { CSSProperties } from 'react'
import { Card } from '../../../../components/ui/Card'
import { Section } from '../../../../components/ui/Section'
import { uiTokens } from '../../../../components/ui/tokens'

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

const inputStyle: CSSProperties = {
  width: '100%',
  border: `1px solid ${uiTokens.colors.borderStrong}`,
  borderRadius: uiTokens.radius.sm,
  ...uiTokens.typography.body,
  color: uiTokens.colors.textPrimary,
  padding: `${uiTokens.spacing.xs}px ${uiTokens.spacing.sm}px`,
  background: uiTokens.colors.surface,
}

const labelStyle: CSSProperties = {
  display: 'grid',
  gap: uiTokens.spacing.xxs,
  ...uiTokens.typography.caption,
  color: uiTokens.colors.textSecondary,
}

const sectionBlockStyle: CSSProperties = {
  border: `1px solid ${uiTokens.colors.border}`,
  borderRadius: uiTokens.radius.md,
  padding: uiTokens.spacing.md,
  background: uiTokens.colors.surface,
}

const fieldsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: uiTokens.spacing.sm,
}

export function InitiativeStep({ form, onTitleChange, onUnidadeChange, onResponsavelChange, onStageChange, onStatusChange }: InitiativeStepProps) {
  return (
    <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
      <Section
        title="1. Sobre a Iniciativa"
        subtitle="Preencha os dados base da iniciativa para seguir com a configuração operacional."
      >
        <div style={sectionBlockStyle}>
          <div style={fieldsGridStyle}>
            <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
              Título da Iniciativa
              <input style={inputStyle} value={form.title} onChange={(event) => onTitleChange(event.target.value)} placeholder="Nome da iniciativa" />
            </label>

            <label style={labelStyle}>
              Unidade
              <input style={inputStyle} value={form.unidade} onChange={(event) => onUnidadeChange(event.target.value)} placeholder="Planta / unidade" />
            </label>

            <label style={labelStyle}>
              Responsável
              <input style={inputStyle} value={form.responsavel} onChange={(event) => onResponsavelChange(event.target.value)} placeholder="Nome do responsável" />
            </label>

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
      </Section>
    </Card>
  )
}
