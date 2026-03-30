import { Button } from '../../../components/ui/Button'
import { tokens } from '../../../components/ui/tokens'
import type { WizardStepOption } from './wizardOptions'

type WizardUiProps = {
  title: string
  subtitle: string
  steps: WizardStepOption[]
  activeStepIndex: number
  onSelectStep: (stepIndex: number) => void
  onBack: () => void
  onNext: () => void
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
  onClose,
}: WizardUiProps) {
  const activeStep = steps[activeStepIndex]

  return (
    <div
      style={{
        background: tokens.colors.surface,
        borderRadius: tokens.radius.lg,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadow.md,
        width: 'min(1100px, 100%)',
        maxHeight: '92vh',
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          padding: tokens.spacing.lg,
          borderBottom: `1px solid ${tokens.colors.border}`,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
        <p style={{ margin: `${tokens.spacing.xs}px 0 0`, color: tokens.colors.textSecondary, fontSize: 14 }}>
          {subtitle}
        </p>
      </header>

      <nav
        style={{
          padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}`,
          borderBottom: `1px solid ${tokens.colors.border}`,
          display: 'flex',
          gap: tokens.spacing.xs,
          overflowX: 'auto',
        }}
      >
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(index)}
              style={{
                whiteSpace: 'nowrap',
                padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
                borderRadius: tokens.radius.sm,
                border: `1px solid ${isActive ? tokens.colors.accent : tokens.colors.borderStrong}`,
                background: isActive ? tokens.colors.accentSoft : tokens.colors.surface,
                color: isActive ? tokens.colors.accent : tokens.colors.textSecondary,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
              aria-current={isActive ? 'step' : undefined}
            >
              {index + 1}. {step.label}
            </button>
          )
        })}
      </nav>

      <section style={{ padding: tokens.spacing.lg, overflowY: 'auto' }}>{activeStep?.render()}</section>

      <footer
        style={{
          padding: tokens.spacing.lg,
          borderTop: `1px solid ${tokens.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          gap: tokens.spacing.sm,
          alignItems: 'center',
        }}
      >
        <Button onClick={onClose} variant="ghost">
          Close
        </Button>

        <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
          <Button onClick={onBack} disabled={activeStepIndex === 0}>
            Back
          </Button>
          <Button onClick={onNext} variant="primary" disabled={activeStepIndex === steps.length - 1}>
            Next
          </Button>
        </div>
      </footer>
    </div>
  )
}
