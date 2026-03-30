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
import { getInitiativeValues } from '../../../application/use-cases/initiative-values/getInitiativeValues'
import { saveComponentValues } from '../../../application/use-cases/initiative-values/saveComponentValues'
import { saveKpiValues } from '../../../application/use-cases/initiative-values/saveKpiValues'
import type { InitiativeComponentDraftDto } from '../../../application/mappers/initiatives/initiativeComponentMappers'
import { getInitiativeComponentDraftErrors } from '../../../application/mappers/initiatives/initiativeComponentMappers'
import {
  buildFixedValueGridRows,
  buildKpiValueGridRows,
  toFixedValueDraftMap,
  toKpiValueDraftMap,
  toSaveComponentValueDtos,
  toSaveKpiValueDtos,
  type MonthNumber,
  type MonthlyInputMap,
} from '../../../application/mappers/initiatives/initiativeValueMappers'
import { tokens } from '../../components/ui/tokens'
import { WizardUi } from './wizard/WizardUi'
import type { WizardStepOption } from './wizard/wizardOptions'
import { InitiativeStep } from './wizard/steps/InitiativeStep'
import { ComponentsStep } from './wizard/steps/ComponentsStep'
import { ValuesStep } from './wizard/steps/ValuesStep'
import { ReviewStep } from './wizard/steps/ReviewStep'
import { mockComponentCatalog, mockConversionCatalog, mockConversionValues, mockFormulaCatalog, mockKpiCatalog } from './mocks/mockCatalogs'
import { previewInitiativeCalculation } from '../../../application/use-cases/calculation/previewInitiativeCalculation'
import { calculateInitiative } from '../../../application/use-cases/calculation/calculateInitiative'
import { asInitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { CalculateInitiativeResultDto } from '../../../application/dto/calculation/CalculateInitiativeResultDto'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'

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


const DEFAULT_VALUES_YEAR = 2026
const DEFAULT_VALUES_SCENARIO = 'BASE' as const

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
  const [valuesYear] = useState<number>(DEFAULT_VALUES_YEAR)
  const [valuesScenario] = useState<typeof DEFAULT_VALUES_SCENARIO>(DEFAULT_VALUES_SCENARIO)
  const [kpiValuesByRow, setKpiValuesByRow] = useState<Readonly<Record<string, MonthlyInputMap>>>({})
  const [fixedValuesByRow, setFixedValuesByRow] = useState<Readonly<Record<string, MonthlyInputMap>>>({})
  const [calculationPreview, setCalculationPreview] = useState<CalculateInitiativeResultDto>({
    initiativeId: asInitiativeId('INIT-NEW'),
    year: valuesYear,
    results: [],
    details: [],
    calculatedAt: new Date().toISOString(),
    issues: [],
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm(getInitialFormState(mode === 'edit' ? selectedInitiative : undefined))
    setActiveStepIndex(0)
    setKpiValuesByRow({})
    setFixedValuesByRow({})
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


  useEffect(() => {
    if (!isOpen || mode !== 'edit' || !selectedInitiative || isLoadingComponents || components.length === 0) {
      return
    }

    const kpiRows = buildKpiValueGridRows(components, mockComponentCatalog, mockKpiCatalog)
    const fixedRows = buildFixedValueGridRows(components, mockComponentCatalog)

    void getInitiativeValues(selectedInitiative.id, valuesYear, valuesScenario).then(({ kpiValues, componentValues }) => {
      setKpiValuesByRow(toKpiValueDraftMap(kpiValues, kpiRows, valuesYear))
      setFixedValuesByRow(toFixedValueDraftMap(componentValues, fixedRows, valuesYear))
    })
  }, [components, isLoadingComponents, isOpen, mode, selectedInitiative, valuesScenario, valuesYear])

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
            components={components}
            componentCatalog={mockComponentCatalog}
            kpiCatalog={mockKpiCatalog}
            conversionCatalog={mockConversionCatalog}
            conversionValues={mockConversionValues}
            year={valuesYear}
            scenario={valuesScenario}
            kpiValuesByRow={kpiValuesByRow}
            fixedValuesByRow={fixedValuesByRow}
            onKpiValueChange={(rowSignature: string, month: MonthNumber, value: string) =>
              setKpiValuesByRow((current) => ({
                ...current,
                [rowSignature]: {
                  ...(current[rowSignature] ?? {}),
                  [month]: value,
                },
              }))
            }
            onFixedValueChange={(rowSignature: string, month: MonthNumber, value: string) =>
              setFixedValuesByRow((current) => ({
                ...current,
                [rowSignature]: {
                  ...(current[rowSignature] ?? {}),
                  [month]: value,
                },
              }))
            }
          />
        ),
      },
      {
        id: 'review',
        label: 'Review',
        render: () => (
          <ReviewStep
            selectedInitiative={selectedInitiative}
            calculation={calculationPreview}
            componentsCount={components.length}
            kpiRowsCount={buildKpiValueGridRows(components, mockComponentCatalog, mockKpiCatalog).length}
            fixedRowsCount={buildFixedValueGridRows(components, mockComponentCatalog).length}
          />
        ),
      },
    ],
    [
      calculationPreview,
      components,
      fixedValuesByRow,
      form,
      isLoadingComponents,
      kpiValuesByRow,
      selectedInitiative,
      valuesScenario,
      valuesYear,
    ],
  )

  useEffect(() => {
    const effectiveInitiativeId = selectedInitiative?.id ?? asInitiativeId('INIT-NEW')
    const persistedLikeComponents: InitiativeComponent[] = components.map((component, index) => {
      const match = mockComponentCatalog.find((item) => item.code === component.componentCode)
      return {
        id: component.id ?? `TMP-${index + 1}`,
        initiativeId: effectiveInitiativeId,
        name: match?.name ?? component.componentCode,
        componentType: match?.componentType ?? component.componentType,
        direction: match?.defaultDirection ?? component.direction,
        calculationType: match?.defaultCalculationType ?? component.calculationType,
        kpiCode: component.kpiCode,
        conversionCode: component.conversionCode,
        formulaCode: component.formulaCode,
        sortOrder: component.sortOrder,
      }
    })

    const kpiRows = buildKpiValueGridRows(components, mockComponentCatalog, mockKpiCatalog)
    const fixedRows = buildFixedValueGridRows(components, mockComponentCatalog)

    void previewInitiativeCalculation({
      initiativeId: effectiveInitiativeId,
      year: valuesYear,
      scenario: valuesScenario,
      components: persistedLikeComponents,
      kpiValues: toSaveKpiValueDtos(effectiveInitiativeId, valuesYear, valuesScenario, kpiRows, kpiValuesByRow),
      componentValues: toSaveComponentValueDtos(effectiveInitiativeId, valuesYear, valuesScenario, fixedRows, fixedValuesByRow),
      conversionValues: mockConversionValues,
    }).then(setCalculationPreview)
  }, [components, fixedValuesByRow, kpiValuesByRow, selectedInitiative?.id, valuesScenario, valuesYear])

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

    const persistedComponents = await getInitiativeComponents(savedInitiative.id, mockComponentCatalog)
    const kpiRows = buildKpiValueGridRows(persistedComponents, mockComponentCatalog, mockKpiCatalog)
    const fixedRows = buildFixedValueGridRows(persistedComponents, mockComponentCatalog)

    await saveKpiValues(toSaveKpiValueDtos(savedInitiative.id, valuesYear, valuesScenario, kpiRows, kpiValuesByRow))
    await saveComponentValues(
      toSaveComponentValueDtos(savedInitiative.id, valuesYear, valuesScenario, fixedRows, fixedValuesByRow),
    )
    await calculateInitiative({
      initiativeId: savedInitiative.id,
      monthRef: `${valuesYear}-01` as MonthRef,
      scenario: valuesScenario,
    })
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
