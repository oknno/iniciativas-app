import { useEffect, useMemo, useState } from 'react'
import type { SaveInitiativeDto } from '../../../application/dto/initiatives/SaveInitiativeDto'
import type { InitiativeDetailDto } from '../../../application/dto/initiatives/InitiativeDetailDto'
import type { InitiativeStage } from '../../../domain/initiatives/entities/InitiativeStage'
import type { InitiativeStatus } from '../../../domain/initiatives/entities/InitiativeStatus'
import { tokens } from '../../components/ui/tokens'
import { WizardUi } from './wizard/WizardUi'
import type { WizardStepOption } from './wizard/wizardOptions'
import { InitiativeStep } from './wizard/steps/InitiativeStep'
import { ComponentsStep } from './wizard/steps/ComponentsStep'
import { ValuesStep } from './wizard/steps/ValuesStep'
import { ReviewStep } from './wizard/steps/ReviewStep'
import { mockCalculationResult } from './mocks/mockCalculation'
import { mockComponentCatalog, mockConversionCatalog, mockKpiCatalog } from './mocks/mockCatalogs'
import { mockComponentValues, mockKpiValues } from './mocks/mockValues'
import type { InitiativeWizardMode } from './hooks/useInitiativesPage'

type InitiativeWizardModalProps = {
  isOpen: boolean
  mode: InitiativeWizardMode
  isSaving: boolean
  selectedInitiative?: InitiativeDetailDto
  onClose: () => void
  onSave: (input: SaveInitiativeDto) => Promise<void>
}

type InitiativeFormState = {
  title: string
  owner: string
  stage: InitiativeStage
  status: InitiativeStatus
}

const getInitialFormState = (initiative: InitiativeDetailDto | undefined): InitiativeFormState => ({
  title: initiative?.title ?? '',
  owner: initiative?.owner ?? '',
  stage: initiative?.stage ?? 'DRAFTING',
  status: initiative?.status ?? 'DRAFT',
})

export function InitiativeWizardModal({ isOpen, mode, isSaving, selectedInitiative, onClose, onSave }: InitiativeWizardModalProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [form, setForm] = useState<InitiativeFormState>(getInitialFormState(selectedInitiative))

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm(getInitialFormState(mode === 'edit' ? selectedInitiative : undefined))
    setActiveStepIndex(0)
  }, [isOpen, mode, selectedInitiative])

  const steps = useMemo<WizardStepOption[]>(
    () => [
      {
        id: 'initiative',
        label: 'Initiative',
        render: () => (
          <InitiativeStep
            form={form}
            onTitleChange={(value) => setForm((current) => ({ ...current, title: value }))}
            onOwnerChange={(value) => setForm((current) => ({ ...current, owner: value }))}
            onStageChange={(value) => setForm((current) => ({ ...current, stage: value }))}
            onStatusChange={(value) => setForm((current) => ({ ...current, status: value }))}
          />
        ),
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
    [form, selectedInitiative],
  )

  if (!isOpen) {
    return null
  }

  const handleClose = () => {
    setActiveStepIndex(0)
    onClose()
  }

  const handleSave = async () => {
    const dto: SaveInitiativeDto = {
      id: mode === 'edit' ? selectedInitiative?.id : undefined,
      code: mode === 'edit' ? (selectedInitiative?.code ?? '') : '',
      title: form.title.trim(),
      description: mode === 'edit' ? selectedInitiative?.description : undefined,
      owner: form.owner.trim(),
      stage: form.stage,
      status: form.status,
      scenario: mode === 'edit' ? (selectedInitiative?.scenario ?? 'BASE') : 'BASE',
      implementationCost: mode === 'edit' ? (selectedInitiative?.implementationCost ?? 50000) : 50000,
      startMonthRef: '2026-01',
      endMonthRef: '2026-12',
    }

    await onSave(dto)
  }

  const isSaveDisabled = form.title.trim().length === 0 || form.owner.trim().length === 0 || isSaving

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
          title={mode === 'create' ? 'Create Initiative' : 'Edit Initiative'}
          subtitle="Use the wizard to maintain initiative setup data."
          steps={steps}
          activeStepIndex={activeStepIndex}
          onSelectStep={setActiveStepIndex}
          onBack={() => setActiveStepIndex((current) => Math.max(current - 1, 0))}
          onNext={() => setActiveStepIndex((current) => Math.min(current + 1, steps.length - 1))}
          onSave={handleSave}
          saveLabel={isSaving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
          disableSave={isSaveDisabled}
          onClose={handleClose}
        />
      </div>
    </div>
  )
}
