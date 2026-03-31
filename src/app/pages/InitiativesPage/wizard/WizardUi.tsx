import type { CSSProperties } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { uiTokens } from '../../../components/ui/tokens'
import type { WizardStepOption } from './wizardOptions'

type WizardUiProps = {
  title: string
  subtitle: string
  steps: WizardStepOption[]
  activeStepIndex: number
  onSelectStep: (stepIndex: number) => void
  onBack: () => void
  onNext: () => void
  nextLabel?: string
  backLabel?: string
  disableNext?: boolean
  onSave: () => void
  saveLabel: string
  disableSave?: boolean
  footerStatus: string
  footerStatusTone?: 'info' | 'success' | 'warning' | 'error'
  onClose: () => void
}

type StepVisualState = 'completed' | 'active' | 'available' | 'blocked'

const getStepVisualState = (stepIndex: number, activeStepIndex: number): StepVisualState => {
  if (stepIndex < activeStepIndex) {
    return 'completed'
  }

  if (stepIndex === activeStepIndex) {
    return 'active'
  }

  if (stepIndex === activeStepIndex + 1) {
    return 'available'
  }

  return 'blocked'
}

const getStepToneStyles = (state: StepVisualState): CSSProperties => {
  if (state === 'active') {
    return {
      border: `1px solid ${uiTokens.colors.accent}`,
      background: uiTokens.colors.accentSoft,
      color: uiTokens.colors.accent,
    }
  }

  if (state === 'completed') {
    return {
      border: `1px solid ${uiTokens.colors.borderStrong}`,
      background: '#f0fdf4',
      color: '#166534',
    }
  }

  if (state === 'available') {
    return {
      border: `1px solid ${uiTokens.colors.borderStrong}`,
      background: uiTokens.colors.surface,
      color: uiTokens.colors.textPrimary,
    }
  }

  return {
    border: `1px solid ${uiTokens.colors.border}`,
    background: '#f3f4f6',
    color: uiTokens.colors.textMuted,
  }
}

export function WizardUi({
  title,
  subtitle,
  steps,
  activeStepIndex,
  onSelectStep,
  onBack,
  onNext,
  nextLabel,
  backLabel,
  disableNext,
  onSave,
  saveLabel,
  disableSave,
  footerStatus,
  footerStatusTone = 'info',
  onClose,
}: WizardUiProps) {
  const activeStep = steps[activeStepIndex]

  const footerStatusColor =
    footerStatusTone === 'success'
      ? '#166534'
      : footerStatusTone === 'warning'
        ? '#92400e'
        : footerStatusTone === 'error'
          ? uiTokens.colors.dangerText
          : uiTokens.colors.textMuted

  return (
    <Card
      style={{
        borderRadius: 14,
        border: `1px solid ${uiTokens.colors.borderStrong}`,
        boxShadow: '0 20px 48px rgba(15, 23, 42, 0.18)',
        width: 'min(1200px, 100vw - 48px)',
        maxHeight: '92vh',
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
        overflow: 'hidden',
        padding: 0,
        background: uiTokens.colors.surface,
      }}
    >
      <header
        style={{
          padding: `${uiTokens.spacing.lg}px ${uiTokens.spacing.xl}px`,
          borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: uiTokens.spacing.lg,
          background: uiTokens.colors.surface,
        }}
      >
        <div>
          <h2 style={{ margin: 0, ...uiTokens.typography.title }}>{title}</h2>
          <p
            style={{
              margin: `${uiTokens.spacing.xs}px 0 0`,
              color: uiTokens.colors.textMuted,
              ...uiTokens.typography.caption,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close wizard"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: `1px solid ${uiTokens.colors.borderStrong}`,
            background: uiTokens.colors.surface,
            color: uiTokens.colors.textSecondary,
            cursor: 'pointer',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </header>

      <nav
        style={{
          padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.xl}px`,
          borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: uiTokens.spacing.md,
          background: uiTokens.colors.surfaceMuted,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: uiTokens.spacing.xs,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {steps.map((step, index) => {
            const stepState = getStepVisualState(index, activeStepIndex)

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStep(index)}
                aria-current={stepState === 'active' ? 'step' : undefined}
                style={{
                  whiteSpace: 'nowrap',
                  borderRadius: 999,
                  padding: '7px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  cursor: 'pointer',
                  ...getStepToneStyles(stepState),
                }}
              >
                {index + 1}. {step.label}
              </button>
            )
          })}
        </div>

        <span style={{ ...uiTokens.typography.caption, color: uiTokens.colors.textMuted, whiteSpace: 'nowrap' }}>
          Etapa {activeStepIndex + 1} de {steps.length}
        </span>
      </nav>

      <section
        style={{
          padding: `${uiTokens.spacing.md}px ${uiTokens.spacing.xl}px ${uiTokens.spacing.lg}px`,
          overflowY: 'auto',
          background: uiTokens.colors.surface,
        }}
      >
        {activeStep?.render()}
      </section>

      <footer
        style={{
          padding: `${uiTokens.spacing.md}px ${uiTokens.spacing.xl}px`,
          borderTop: `1px solid ${uiTokens.colors.borderStrong}`,
          display: 'flex',
          justifyContent: 'space-between',
          gap: uiTokens.spacing.sm,
          alignItems: 'center',
          background: uiTokens.colors.surface,
        }}
      >
        <span style={{ ...uiTokens.typography.caption, color: footerStatusColor }}>
          {footerStatus}
        </span>

        <div style={{ display: 'flex', gap: uiTokens.spacing.sm }}>
          <Button onClick={onBack} disabled={activeStepIndex === 0}>
            {backLabel ?? 'Voltar'}
          </Button>
          <Button onClick={onNext} disabled={activeStepIndex === steps.length - 1 || disableNext}>
            {nextLabel ?? 'Próximo'}
          </Button>
          <Button onClick={onSave} tone="primary" disabled={disableSave}>
            {saveLabel}
          </Button>
        </div>
      </footer>
    </Card>
  )
}
