import { useEffect, useMemo, useState } from 'react'
import type { ConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import type { FormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import type { KpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { SaveInitiativeDto } from '../../../application/dto/initiatives/SaveInitiativeDto'
import type { InitiativeDetailDto } from '../../../application/dto/initiatives/InitiativeDetailDto'
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
import type { WizardStepId, WizardStepOption } from './wizard/wizardOptions'
import { InitiativeStep } from './wizard/steps/InitiativeStep'
import { ComponentsStep } from './wizard/steps/ComponentsStep'
import { ValuesStep } from './wizard/steps/ValuesStep'
import { ReviewStep } from './wizard/steps/ReviewStep'
import { previewInitiativeCalculation } from '../../../application/use-cases/calculation/previewInitiativeCalculation'
import { calculateInitiative } from '../../../application/use-cases/calculation/calculateInitiative'
import { getCalculationDetails } from '../../../application/use-cases/calculation/getCalculationDetails'
import { getCalculationResult } from '../../../application/use-cases/calculation/getCalculationResult'
import { asInitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import type { InitiativeComponent } from '../../../domain/initiatives/entities/InitiativeComponent'
import type { CalculateInitiativeResultDto } from '../../../application/dto/calculation/CalculateInitiativeResultDto'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'
import { getCatalogs } from '../../../application/use-cases/catalogs/getCatalogs'
import type { CatalogsDtoBundle } from '../../../application/mappers/catalogs/catalogMappers'
import { useAccess } from '../../access/AccessContext'

import type { InitiativeWizardMode } from './hooks/useInitiativesPage'

type InitiativeWizardModalProps = {
  isOpen: boolean
  mode: InitiativeWizardMode
  isSaving: boolean
  selectedInitiative?: InitiativeDetailDto
  onClose: () => void
  onSave: (input: SaveInitiativeDto) => Promise<InitiativeDetailDto>
  allowedStepIds?: readonly WizardStepId[]
  allowSave?: boolean
}

type InitiativeFormState = {
  title: string
  unidade: string
  responsavel: string
  stage: string
  status: string
}

const getInitialFormState = (initiative: InitiativeDetailDto | undefined): InitiativeFormState => ({
  title: initiative?.title ?? '',
  unidade: initiative?.unidade ?? '',
  responsavel: initiative?.responsavel ?? '',
  stage: initiative?.stage ?? '',
  status: initiative?.status ?? 'DRAFT_OWNER',
})


const DEFAULT_VALUES_YEAR = 2026
const DEFAULT_VALUES_SCENARIO = 'BASE' as const

const emptyCatalogs: CatalogsDtoBundle = {
  componentCatalog: [],
  kpiCatalog: [],
  conversionCatalog: [],
  formulaCatalog: [],
  conversionValues: [],
}

const getNewComponentDraft = (formulaCode?: FormulaCode): InitiativeComponentDraftDto => ({
  componentCode: '',
  componentType: 'OTHER',
  direction: 1,
  calculationType: 'KPI_BASED',
  formulaCode,
  sortOrder: 1,
})

export function InitiativeWizardModal({
  isOpen,
  mode,
  isSaving,
  selectedInitiative,
  onClose,
  onSave,
  allowedStepIds,
  allowSave = true,
}: InitiativeWizardModalProps) {
  const { actor } = useAccess()
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [form, setForm] = useState<InitiativeFormState>(getInitialFormState(selectedInitiative))
  const [components, setComponents] = useState<readonly InitiativeComponentDraftDto[]>([])
  const [isLoadingComponents, setIsLoadingComponents] = useState<boolean>(false)
  const [isLoadingValues, setIsLoadingValues] = useState<boolean>(false)
  const [valuesYear] = useState<number>(DEFAULT_VALUES_YEAR)
  const [valuesScenario] = useState<typeof DEFAULT_VALUES_SCENARIO>(DEFAULT_VALUES_SCENARIO)
  const [kpiValuesByRow, setKpiValuesByRow] = useState<Readonly<Record<string, MonthlyInputMap>>>({})
  const [fixedValuesByRow, setFixedValuesByRow] = useState<Readonly<Record<string, MonthlyInputMap>>>({})
  const [catalogs, setCatalogs] = useState<CatalogsDtoBundle>(emptyCatalogs)
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState<boolean>(false)
  const [isPreviewCalculating, setIsPreviewCalculating] = useState<boolean>(false)
  const [componentsLoadError, setComponentsLoadError] = useState<string | null>(null)
  const [valuesLoadError, setValuesLoadError] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
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

    setIsLoadingCatalogs(true)
    void getCatalogs()
      .then(setCatalogs)
      .catch((error) => {
        console.error('Failed to load catalogs from SharePoint.', error)
        setCatalogs(emptyCatalogs)
      })
      .finally(() => setIsLoadingCatalogs(false))
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode !== 'edit' || !selectedInitiative) {
      setComponents([])
      return
    }

    setIsLoadingComponents(true)
    setComponentsLoadError(null)
    console.log('[InitiativeWizard] Loading data for selected initiative id:', selectedInitiative.id)
    void getInitiativeComponents(selectedInitiative.id, catalogs.componentCatalog)
      .then((loadedComponents) => {
        console.log('[InitiativeWizard] Loaded Initiative_Component records:', loadedComponents)
        console.log('[InitiativeWizard] Resolved component codes:', loadedComponents.map((item) => item.componentCode))
        console.log('[InitiativeWizard] Resolved KPI codes:', loadedComponents.map((item) => item.kpiCode).filter(Boolean))
        console.log('[InitiativeWizard] Resolved conversion codes:', loadedComponents.map((item) => item.conversionCode).filter(Boolean))
        setComponents(loadedComponents)
      })
      .catch((error) => {
        console.error('Failed to load initiative components from SharePoint.', error)
        setComponents([])
        setComponentsLoadError('Não foi possível carregar os componentes da iniciativa.')
      })
      .finally(() => setIsLoadingComponents(false))
  }, [catalogs.componentCatalog, isOpen, mode, selectedInitiative])


  useEffect(() => {
    if (
      !isOpen ||
      mode !== 'edit' ||
      !selectedInitiative ||
      isLoadingComponents ||
      components.length === 0 ||
      isLoadingCatalogs
    ) {
      return
    }

    const kpiRows = buildKpiValueGridRows(components, catalogs.componentCatalog, catalogs.kpiCatalog)
    const fixedRows = buildFixedValueGridRows(components, catalogs.componentCatalog)

    setIsLoadingValues(true)
    setValuesLoadError(null)
    void getInitiativeValues(selectedInitiative.id, valuesYear, valuesScenario)
      .then(({ kpiValues, componentValues }) => {
        const mappedKpiRows = toKpiValueDraftMap(kpiValues, kpiRows, valuesYear)
        const mappedFixedRows = toFixedValueDraftMap(componentValues, fixedRows, valuesYear)
        console.log('[InitiativeWizard] Loaded KPI values (raw):', kpiValues)
        console.log('[InitiativeWizard] Loaded fixed values (raw):', componentValues)
        console.log('[InitiativeWizard] Mapped KPI value rows:', mappedKpiRows)
        console.log('[InitiativeWizard] Mapped fixed value rows:', mappedFixedRows)
        setKpiValuesByRow(mappedKpiRows)
        setFixedValuesByRow(mappedFixedRows)
      })
      .catch((error) => {
        console.error('Failed to load initiative values from SharePoint.', error)
        setKpiValuesByRow({})
        setFixedValuesByRow({})
        setValuesLoadError('Não foi possível carregar os valores mensais da iniciativa.')
      })
      .finally(() => setIsLoadingValues(false))
  }, [
    catalogs.componentCatalog,
    catalogs.kpiCatalog,
    components,
    isLoadingCatalogs,
    isLoadingComponents,
    isOpen,
    mode,
    selectedInitiative,
    valuesScenario,
    valuesYear,
  ])

  useEffect(() => {
    if (!isOpen || mode !== 'edit' || !selectedInitiative) {
      return
    }

    void Promise.all([getCalculationResult(selectedInitiative.id), getCalculationDetails(selectedInitiative.id)])
      .then(([results, details]) => {
        console.log('[InitiativeWizard] Loaded calculation result rows:', results)
        console.log('[InitiativeWizard] Loaded calculation detail rows:', details)
        if (results.length === 0 && details.length === 0) {
          return
        }

        setCalculationPreview({
          initiativeId: selectedInitiative.id,
          year: results[0]?.year ?? details[0]?.year ?? valuesYear,
          results,
          details,
          calculatedAt: new Date().toISOString(),
          issues: [],
        })
      })
      .catch((error) => {
        console.error('Failed to load persisted calculation from SharePoint.', error)
      })
  }, [isOpen, mode, selectedInitiative, valuesYear])

  const allSteps = useMemo<WizardStepOption[]>(
    () => [
      {
        id: 'initiative',
        label: 'Iniciativa',
        render: () => (
          <InitiativeStep
            form={form}
            onTitleChange={(value) => setForm((current) => ({ ...current, title: value }))}
            onUnidadeChange={(value) => setForm((current) => ({ ...current, unidade: value }))}
            onResponsavelChange={(value) => setForm((current) => ({ ...current, responsavel: value }))}
            onStageChange={(value) => setForm((current) => ({ ...current, stage: value }))}
            onStatusChange={(value) => setForm((current) => ({ ...current, status: value }))}
          />
        ),
      },
      {
        id: 'components',
        label: 'Componentes',
        render: () => (
          <ComponentsStep
            components={components}
            componentCatalog={catalogs.componentCatalog}
            kpiCatalog={catalogs.kpiCatalog}
            conversionCatalog={catalogs.conversionCatalog}
            formulaCatalog={catalogs.formulaCatalog}
            isLoading={isLoadingComponents || isLoadingCatalogs}
            loadingMessage={
              isLoadingCatalogs ? 'Carregando catálogos da iniciativa...' : 'Carregando componentes da iniciativa...'
            }
            loadErrorMessage={componentsLoadError}
            onAddComponent={() =>
              setComponents((current) => [
                ...current,
                {
                  ...getNewComponentDraft(catalogs.formulaCatalog[0]?.code),
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
                  const selectedCatalog =
                    catalogs.componentCatalog.find((catalogItem) => catalogItem.componentType === nextComponentCode) ??
                    catalogs.componentCatalog.find((catalogItem) => catalogItem.code === nextComponentCode)
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
        label: 'Valores',
        render: () => (
          <ValuesStep
            components={components}
            componentCatalog={catalogs.componentCatalog}
            kpiCatalog={catalogs.kpiCatalog}
            conversionCatalog={catalogs.conversionCatalog}
            conversionValues={catalogs.conversionValues}
            year={valuesYear}
            scenario={valuesScenario}
            initiativeId={selectedInitiative?.id}
            isLoadingValues={isLoadingValues}
            valuesLoadErrorMessage={valuesLoadError}
            isPreviewCalculating={isPreviewCalculating}
            previewErrorMessage={previewError}
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
        label: 'Revisão',
        render: () => (
          <ReviewStep
            selectedInitiative={selectedInitiative}
            calculation={calculationPreview}
            isCalculating={isPreviewCalculating}
            previewErrorMessage={previewError}
            componentsCount={components.length}
            kpiRowsCount={buildKpiValueGridRows(components, catalogs.componentCatalog, catalogs.kpiCatalog).length}
            fixedRowsCount={buildFixedValueGridRows(components, catalogs.componentCatalog).length}
          />
        ),
      },
    ],
    [
      calculationPreview,
      catalogs.componentCatalog,
      catalogs.conversionCatalog,
      catalogs.conversionValues,
      catalogs.formulaCatalog,
      catalogs.kpiCatalog,
      components,
      fixedValuesByRow,
      form,
      isLoadingComponents,
      isLoadingCatalogs,
      isLoadingValues,
      isPreviewCalculating,
      kpiValuesByRow,
      componentsLoadError,
      previewError,
      selectedInitiative,
      valuesScenario,
      valuesYear,
      valuesLoadError,
    ],
  )

  const steps = useMemo<WizardStepOption[]>(() => {
    if (!allowedStepIds || allowedStepIds.length === 0) {
      return allSteps
    }

    return allSteps.filter((step) => allowedStepIds.includes(step.id))
  }, [allSteps, allowedStepIds])


  useEffect(() => {
    if (activeStepIndex < steps.length) {
      return
    }

    setActiveStepIndex(0)
  }, [activeStepIndex, steps.length])
  useEffect(() => {
    const effectiveInitiativeId = selectedInitiative?.id ?? asInitiativeId('INIT-NEW')
    const persistedLikeComponents: InitiativeComponent[] = components.map((component, index) => {
      const match =
        catalogs.componentCatalog.find((item) => item.componentType === component.componentType) ??
        catalogs.componentCatalog.find((item) => item.code === component.componentCode)
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

    const kpiRows = buildKpiValueGridRows(components, catalogs.componentCatalog, catalogs.kpiCatalog)
    const fixedRows = buildFixedValueGridRows(components, catalogs.componentCatalog)
    const kpiPayload = toSaveKpiValueDtos(effectiveInitiativeId, valuesYear, valuesScenario, kpiRows, kpiValuesByRow)
    const fixedPayload = toSaveComponentValueDtos(effectiveInitiativeId, valuesYear, valuesScenario, fixedRows, fixedValuesByRow)

    setIsPreviewCalculating(true)
    setPreviewError(null)
    void previewInitiativeCalculation({
      initiativeId: effectiveInitiativeId,
      year: valuesYear,
      scenario: valuesScenario,
      components: persistedLikeComponents,
      kpiValues: kpiPayload,
      componentValues: fixedPayload,
      conversionValues: catalogs.conversionValues,
    })
      .then((preview) => {
        console.log('[InitiativeWizard] Preview calculation input:', {
          initiativeId: effectiveInitiativeId,
          components: persistedLikeComponents,
          kpiValues: kpiPayload,
          fixedValues: fixedPayload,
        })
        console.log('[InitiativeWizard] Preview calculation output:', preview)
        setCalculationPreview(preview)
      })
      .catch((error) => {
        console.error('Failed to preview initiative calculation.', error)
        setPreviewError('Não foi possível atualizar o preview de cálculo.')
      })
      .finally(() => setIsPreviewCalculating(false))
  }, [
    catalogs.componentCatalog,
    catalogs.conversionValues,
    catalogs.kpiCatalog,
    components,
    fixedValuesByRow,
    kpiValuesByRow,
    selectedInitiative?.id,
    valuesScenario,
    valuesYear,
  ])

  if (!isOpen) {
    return null
  }

  const handleClose = () => {
    setActiveStepIndex(0)
    onClose()
  }

  const handleSave = async () => {
    if (!actor) {
      throw new Error('Acesso não configurado para o usuário atual.')
    }

    const resolvedStatus = form.status.trim() || 'DRAFT_OWNER'
    console.info('[Initiative Save] status usado no save:', {
      mode,
      initiativeId: selectedInitiative?.id ?? 'NEW',
      status: resolvedStatus,
    })

    const dto: SaveInitiativeDto = {
      id: mode === 'edit' ? selectedInitiative?.id : undefined,
      title: form.title.trim(),
      unidade: form.unidade.trim(),
      responsavel: form.responsavel.trim(),
      stage: form.stage.trim(),
      status: resolvedStatus,
    }

    const savedInitiative = await onSave(dto)
    console.log('[Initiative Save] initiative id after save:', savedInitiative.id)
    await saveInitiativeComponents(savedInitiative.id, components, catalogs.componentCatalog, actor)

    const persistedComponents = await getInitiativeComponents(savedInitiative.id, catalogs.componentCatalog)
    console.log('[Initiative Save] components payload sent:', persistedComponents)
    const kpiRows = buildKpiValueGridRows(persistedComponents, catalogs.componentCatalog, catalogs.kpiCatalog)
    const fixedRows = buildFixedValueGridRows(persistedComponents, catalogs.componentCatalog)
    const kpiPayload = toSaveKpiValueDtos(savedInitiative.id, valuesYear, valuesScenario, kpiRows, kpiValuesByRow)
    const fixedPayload = toSaveComponentValueDtos(savedInitiative.id, valuesYear, valuesScenario, fixedRows, fixedValuesByRow)

    console.log('[Initiative Save] KPI values payload sent:', kpiPayload)
    console.log('[Initiative Save] fixed values payload sent:', fixedPayload)
    await saveKpiValues(kpiPayload, actor, savedInitiative.id)
    await saveComponentValues(fixedPayload, actor, savedInitiative.id)
    const calculationInput = {
      initiativeId: savedInitiative.id,
      monthRef: `${valuesYear}-01` as MonthRef,
      scenario: valuesScenario,
    }
    console.log('[Initiative Save] calculation input:', calculationInput)
    const calculated = await calculateInitiative(calculationInput)
    console.log('[Initiative Save] calculation output:', calculated)
    console.log('[Initiative Save] calculation result saved confirmation:', {
      initiativeId: calculated.initiativeId,
      results: calculated.results.length,
      details: calculated.details.length,
    })
  }

  const hasInvalidComponent = components.some(
    (component) => getInitiativeComponentDraftErrors(component, catalogs.componentCatalog).length > 0,
  )
  const isInitiativeInfoInvalid = form.title.trim().length === 0 || form.unidade.trim().length === 0 || form.responsavel.trim().length === 0
  const canMoveToNextStep = !isLoadingCatalogs && !isLoadingComponents && !isLoadingValues && !isPreviewCalculating
  const hasBlockingIssues = isInitiativeInfoInvalid || hasInvalidComponent
  const isSaveDisabled =
    isInitiativeInfoInvalid || isSaving || hasInvalidComponent

  const footerStatus = isSaving
    ? 'Salvando iniciativa...'
    : isLoadingComponents
      ? 'Carregando componentes da iniciativa...'
      : isLoadingValues
        ? 'Buscando valores mensais...'
        : isPreviewCalculating
          ? 'Atualizando resultado...'
          : componentsLoadError ?? valuesLoadError ?? previewError ?? (
            hasBlockingIssues
              ? 'Existem pendências antes de continuar.'
              : calculationPreview.results.length > 0
                ? 'Resultado calculado com sucesso.'
                : 'Rascunho ainda não salvo.'
          )

  const footerStatusTone: 'info' | 'success' | 'warning' | 'error' =
    componentsLoadError || valuesLoadError || previewError
      ? 'error'
      : isSaving || isLoadingComponents || isLoadingValues || isPreviewCalculating
        ? 'info'
        : hasBlockingIssues
          ? 'warning'
          : calculationPreview.results.length > 0
            ? 'success'
            : 'info'

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
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Initiative Wizard"
        onClick={(event) => event.stopPropagation()}
        style={{ width: '100%', display: 'grid', placeItems: 'center' }}
      >
        <WizardUi
          title={mode === 'create' ? 'Nova Iniciativa' : 'Editar Iniciativa'}
          subtitle="Preencha as etapas para configurar, validar e salvar a iniciativa."
          steps={steps}
          activeStepIndex={activeStepIndex}
          onSelectStep={setActiveStepIndex}
          onBack={() => setActiveStepIndex((current) => Math.max(current - 1, 0))}
          onNext={() => setActiveStepIndex((current) => Math.min(current + 1, steps.length - 1))}
          disableNext={!canMoveToNextStep}
          nextLabel={!canMoveToNextStep ? 'Aguarde...' : activeStepIndex === steps.length - 2 ? 'Revisar' : 'Próximo'}
          backLabel="Voltar"
          onSave={handleSave}
          saveLabel={allowSave ? (isSaving ? 'Salvando iniciativa...' : 'Salvar rascunho') : 'Somente leitura'}
          disableSave={!allowSave || isSaveDisabled}
          footerStatus={footerStatus}
          footerStatusTone={footerStatusTone}
          onClose={handleClose}
        />
      </div>
    </div>
  )
}
