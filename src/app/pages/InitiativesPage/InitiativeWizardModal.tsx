import { useEffect, useMemo, useState } from 'react'
import type { ConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import type { FormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import type { KpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { SaveInitiativeDto } from '../../../application/dto/initiatives/SaveInitiativeDto'
import type { InitiativeDetailDto } from '../../../application/dto/initiatives/InitiativeDetailDto'
import type { InitiativeStage } from '../../../domain/initiatives/entities/InitiativeStage'
import type { InitiativeStatus } from '../../../domain/initiatives/entities/InitiativeStatus'
import { getInitiativeComponents } from '../../../application/use-cases/initiative-components/getInitiativeComponents'
import { saveInitiativeComponents } from '../../../application/use-cases/initiative-components/saveInitiativeComponents'
import type { InitiativeComponentDraftDto } from '../../../application/mappers/initiatives/initiativeComponentMappers'
import { getInitiativeComponentDraftErrors } from '../../../application/mappers/initiatives/initiativeComponentMappers'
import { tokens } from '../../components/ui/tokens'
import { WizardUi } from './wizard/WizardUi'
import type { WizardStepOption } from './wizard/wizardOptions'
import { InitiativeStep } from './wizard/steps/InitiativeStep'
import { ComponentsStep } from './wizard/steps/ComponentsStep'
import { ValuesStep } from './wizard/steps/ValuesStep'
import { ReviewStep } from './wizard/steps/ReviewStep'
import { mockCalculationResult } from './mocks/mockCalculation'
import { mockComponentCatalog, mockConversionCatalog, mockFormulaCatalog, mockKpiCatalog } from './mocks/mockCatalogs'
import { mockComponentValues, mockKpiValues } from './mocks/mockValues'
import type { InitiativeWizardMode } from './hooks/useInitiativesPage'

type InitiativeWizardModalProps = {
  isOpen: boolean
  mode: InitiativeWizardMode
  isSaving: boolean
  selectedInitiative?: InitiativeDetailDto
  onClose: () => void
  onSave: (input: SaveInitiativeDto) => Promise<InitiativeDetailDto>
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

const getNewComponentDraft = (): InitiativeComponentDraftDto => ({
  componentCode: '',
  componentType: 'OTHER',
  direction: 1,
  calculationType: 'KPI_BASED',
  formulaCode: mockFormulaCatalog[0]?.code,
  sortOrder: 1,
})

export function InitiativeWizardModal({ isOpen, mode, isSaving, selectedInitiative, onClose, onSave }: InitiativeWizardModalProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [form, setForm] = useState<InitiativeFormState>(getInitialFormState(selectedInitiative))
  const [components, setComponents] = useState<readonly InitiativeComponentDraftDto[]>([])
  const [isLoadingComponents, setIsLoadingComponents] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm(getInitialFormState(mode === 'edit' ? selectedInitiative : undefined))
    setActiveStepIndex(0)
  }, [isOpen, mode, selectedInitiative])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode !== 'edit' || !selectedInitiative) {
      setComponents([])
      return
    }

    setIsLoadingComponents(true)
    void getInitiativeComponents(selectedInitiative.id, mockComponentCatalog)
      .then(setComponents)
      .finally(() => setIsLoadingComponents(false))
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
            components={components}
            componentCatalog={mockComponentCatalog}
            kpiCatalog={mockKpiCatalog}
            conversionCatalog={mockConversionCatalog}
            formulaCatalog={mockFormulaCatalog}
            isLoading={isLoadingComponents}
            onAddComponent={() =>
              setComponents((current) => [
                ...current,
                {
                  ...getNewComponentDraft(),
                  sortOrder: current.length + 1,
                },
              ])
            }
            onRemoveComponent={(index) =>
              setComponents((current) => current.filter((_, currentIndex) => currentIndex !== index).map((item, i) => ({ ...item, sortOrder: i + 1 })))
            }
            onUpdateComponent={(index, patch) =>
              setComponents((current) =>
                current.map((component, componentIndex) => {
                  if (componentIndex !== index) {
                    return component
                  }

                  const nextComponentCode = patch.componentCode ?? component.componentCode
                  const selectedCatalog = mockComponentCatalog.find((catalogItem) => catalogItem.code === nextComponentCode)
                  const calculationType = selectedCatalog?.defaultCalculationType ?? component.calculationType

                  return {
                    ...component,
                    ...patch,
                    componentType: selectedCatalog?.componentType ?? component.componentType,
                    direction: selectedCatalog?.defaultDirection ?? component.direction,
                    calculationType,
                    kpiCode:
                      calculationType === 'FIXED'
                        ? undefined
                        : ((patch.kpiCode ?? component.kpiCode) as KpiCode | undefined),
                    conversionCode:
                      calculationType === 'FIXED'
                        ? undefined
                        : ((patch.conversionCode ?? component.conversionCode) as ConversionCode | undefined),
                    formulaCode: (patch.formulaCode ?? component.formulaCode) as FormulaCode | undefined,
                  }
                }),
              )
            }
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
    [components, form, isLoadingComponents, selectedInitiative],
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

    const savedInitiative = await onSave(dto)
    await saveInitiativeComponents(savedInitiative.id, components, mockComponentCatalog)
  }

  const hasInvalidComponent = components.some((component) => getInitiativeComponentDraftErrors(component, mockComponentCatalog).length > 0)
  const isSaveDisabled = form.title.trim().length === 0 || form.owner.trim().length === 0 || isSaving || hasInvalidComponent

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
