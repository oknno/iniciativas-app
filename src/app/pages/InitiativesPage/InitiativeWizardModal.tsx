import { useMemo, useState } from 'react'
import { tokens } from '../../components/ui/tokens'
import { WizardUi } from './wizard/WizardUi'
import type { WizardStepOption } from './wizard/wizardOptions'
import { InitiativeStep } from './wizard/steps/InitiativeStep'
import { ComponentsStep } from './wizard/steps/ComponentsStep'
import { ValuesStep } from './wizard/steps/ValuesStep'
import { ReviewStep } from './wizard/steps/ReviewStep'
import type { InitiativeDetailDto } from '../../../application/dto/initiatives/InitiativeDetailDto'
import { mockCalculationResult } from './mocks/mockCalculation'
import { mockComponentCatalog, mockConversionCatalog, mockKpiCatalog } from './mocks/mockCatalogs'
import { mockComponentValues, mockKpiValues } from './mocks/mockValues'

type InitiativeWizardModalProps = {
  isOpen: boolean
  selectedInitiative?: InitiativeDetailDto
  onClose: () => void
}

export function InitiativeWizardModal({ isOpen, selectedInitiative, onClose }: InitiativeWizardModalProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)

  const steps = useMemo<WizardStepOption[]>(
    () => [
      {
        id: 'initiative',
        label: 'Initiative',
        render: () => <InitiativeStep selectedInitiative={selectedInitiative} />,
      },
      {
        id: 'components',
        label: 'Components',
        render: () => (
          <ComponentsStep
            selectedInitiative={selectedInitiative}
            componentCatalogSize={mockComponentCatalog.length}
            kpiCatalogSize={mockKpiCatalog.length}
            conversionCatalogSize={mockConversionCatalog.length}
          />
        ),
      },
      {
        id: 'values',
        label: 'Values',
        render: () => (
          <ValuesStep
            selectedInitiative={selectedInitiative}
            kpiValuesCount={mockKpiValues.length}
            componentValuesCount={mockComponentValues.length}
          />
        ),
      },
      {
        id: 'review',
        label: 'Review',
        render: () => <ReviewStep selectedInitiative={selectedInitiative} calculation={mockCalculationResult} />,
      },
    ],
    [selectedInitiative],
  )

  if (!isOpen) {
    return null
  }

  const handleClose = () => {
    setActiveStepIndex(0)
    onClose()
  }

  return (
    <div
      role="presentation"
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.35)',
        zIndex: tokens.zIndex.toast + 1,
        display: 'grid',
        placeItems: 'center',
        padding: tokens.spacing.lg,
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Initiative Wizard" onClick={(event) => event.stopPropagation()}>
        <WizardUi
          title="Initiative Wizard"
          subtitle="Create or edit initiatives through a structured workflow."
          steps={steps}
          activeStepIndex={activeStepIndex}
          onSelectStep={setActiveStepIndex}
          onBack={() => setActiveStepIndex((current) => Math.max(current - 1, 0))}
          onNext={() => setActiveStepIndex((current) => Math.min(current + 1, steps.length - 1))}
          onClose={handleClose}
        />
      </div>
    </div>
  )
}
