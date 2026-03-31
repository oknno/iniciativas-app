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
  onSave: () => void
  saveLabel: string
  disableSave?: boolean
  onClose: () => void
}

export function WizardUi({
  title,
  subtitle,
  steps,
  activeStepIndex,
  onSelectStep,
  onBack,
  onNext,
  onSave,
  saveLabel,
  disableSave,
  onClose,
}: WizardUiProps) {
  const activeStep = steps[activeStepIndex]

  return (
    <Card
      style={{
        borderRadius: uiTokens.radius.lg,
        border: `1px solid ${uiTokens.colors.borderStrong}`,
        boxShadow: uiTokens.shadow.md,
        width: 'min(1100px, 100%)',
        maxHeight: '92vh',
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <header
        style={{
          padding: `${uiTokens.spacing.md}px ${uiTokens.spacing.lg}px`,
          borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
          background: uiTokens.colors.surfaceMuted,
        }}
      >
        <h2 style={{ margin: 0, ...uiTokens.typography.title }}>{title}</h2>
        <p style={{ margin: `${uiTokens.spacing.xs}px 0 0`, color: uiTokens.colors.textSecondary, ...uiTokens.typography.caption }}>{subtitle}</p>
      </header>

      <nav
        style={{
          padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.lg}px`,
          borderBottom: `1px solid ${uiTokens.colors.borderStrong}`,
          display: 'flex',
          gap: uiTokens.spacing.xs,
          overflowX: 'auto',
          background: uiTokens.colors.surfaceMuted,
        }}
      >
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex

          return (
            <Button
              key={step.id}
              onClick={() => onSelectStep(index)}
              tone={isActive ? 'primary' : 'secondary'}
              aria-current={isActive ? 'step' : undefined}
              style={{ whiteSpace: 'nowrap' }}
            >
              {index + 1}. {step.label}
            </Button>
          )
        })}
      </nav>

      <section style={{ padding: `${uiTokens.spacing.md}px ${uiTokens.spacing.lg}px`, overflowY: 'auto', background: uiTokens.colors.surfaceMuted }}>
        {activeStep?.render()}
      </section>

      <footer
        style={{
          padding: `${uiTokens.spacing.md}px ${uiTokens.spacing.lg}px`,
          borderTop: `1px solid ${uiTokens.colors.borderStrong}`,
          display: 'flex',
          justifyContent: 'space-between',
          gap: uiTokens.spacing.sm,
          alignItems: 'center',
        }}
      >
        <Button onClick={onClose} tone="ghost">
          Close
        </Button>

        <div style={{ display: 'flex', gap: uiTokens.spacing.sm }}>
          <Button onClick={onBack} disabled={activeStepIndex === 0}>
            Back
          </Button>
          <Button onClick={onNext} disabled={activeStepIndex === steps.length - 1}>
            Next
          </Button>
          <Button onClick={onSave} tone="primary" disabled={disableSave}>
            {saveLabel}
          </Button>
        </div>
      </footer>
    </Card>
  )
}
