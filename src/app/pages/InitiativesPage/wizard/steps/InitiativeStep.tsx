import type { CSSProperties } from 'react'
import { Card } from '../../../../components/ui/Card'
import { Section } from '../../../../components/ui/Section'
import { uiTokens } from '../../../../components/ui/tokens'

type InitiativeStepForm = {
  title: string
  unidade: string
  responsavel: string
  stage: string
  decisionComment?: string
}

type InitiativeStepProps = {
  form: InitiativeStepForm
  onTitleChange: (value: string) => void
  onUnidadeChange: (value: string) => void
  onResponsavelChange: (value: string) => void
  onStageChange: (value: string) => void
  onDecisionCommentChange: (value: string) => void
}

const inputStyle: CSSProperties = {
  width: '100%',
  border: `1px solid ${uiTokens.colors.borderStrong}`,
  borderRadius: uiTokens.radius.sm,
  ...uiTokens.typography.body,
  color: uiTokens.colors.textPrimary,
  height: 36,
  padding: `0 ${uiTokens.spacing.sm}px`,
  background: uiTokens.colors.surface,
}

const labelStyle: CSSProperties = {
  display: 'grid',
  gap: 6,
  ...uiTokens.typography.caption,
  color: uiTokens.colors.textMuted,
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
  columnGap: uiTokens.spacing.md,
  rowGap: uiTokens.spacing.md,
  alignItems: 'start',
}

export function InitiativeStep({
  form,
  onTitleChange,
  onUnidadeChange,
  onResponsavelChange,
  onStageChange,
  onDecisionCommentChange,
}: InitiativeStepProps) {
  const isTitleMissing = form.title.trim().length === 0
  const isUnidadeMissing = form.unidade.trim().length === 0
  const isResponsavelMissing = form.responsavel.trim().length === 0
  const hasRequiredMissing = isTitleMissing || isUnidadeMissing || isResponsavelMissing

  return (
    <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
      <Section
        title="1. Sobre a Iniciativa"
        subtitle="Preencha os dados base da iniciativa para seguir com a configuração operacional."
      >
        {hasRequiredMissing ? (
          <div
            style={{
              marginBottom: uiTokens.spacing.sm,
              border: `1px solid ${uiTokens.colors.warningText}`,
              borderRadius: uiTokens.radius.sm,
              padding: `${uiTokens.spacing.xs}px ${uiTokens.spacing.sm}px`,
              color: uiTokens.colors.warningText,
              ...uiTokens.typography.caption,
            }}
          >
            Faltam informações obrigatórias para continuar.
          </div>
        ) : null}
        <div style={sectionBlockStyle}>
          <div style={fieldsGridStyle}>
            <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
              Título da Iniciativa
              <input style={inputStyle} value={form.title} onChange={(event) => onTitleChange(event.target.value)} placeholder="Nome da iniciativa" />
              {isTitleMissing ? <span style={fieldErrorStyle}>Informe o título da iniciativa.</span> : null}
            </label>

            <label style={labelStyle}>
              Unidade
              <input style={inputStyle} value={form.unidade} onChange={(event) => onUnidadeChange(event.target.value)} placeholder="Planta / unidade" />
              {isUnidadeMissing ? <span style={fieldErrorStyle}>Informe a unidade responsável.</span> : null}
            </label>

            <label style={labelStyle}>
              Responsável
              <input style={inputStyle} value={form.responsavel} onChange={(event) => onResponsavelChange(event.target.value)} placeholder="Nome do responsável" />
              {isResponsavelMissing ? <span style={fieldErrorStyle}>Informe o responsável da iniciativa.</span> : null}
            </label>

            <label style={labelStyle}>
              Stage
              <input style={inputStyle} value={form.stage} onChange={(event) => onStageChange(event.target.value)} placeholder="Stage" />
            </label>

            <label style={{ ...labelStyle, gridColumn: '1 / -1' }}>
              Comentário da decisão (obrigatório para devolução/reprovação)
              <input
                style={inputStyle}
                value={form.decisionComment ?? ''}
                onChange={(event) => onDecisionCommentChange(event.target.value)}
                placeholder="Descreva o motivo da decisão"
              />
            </label>
          </div>
        </div>
      </Section>
    </Card>
  )
}

const fieldErrorStyle: CSSProperties = {
  color: uiTokens.colors.dangerText,
  ...uiTokens.typography.caption,
}
