import type { CalculateInitiativeResultDto } from '../../dto/calculation/CalculateInitiativeResultDto'
import type { ComponentMasterDto } from '../../dto/catalogs/ComponentMasterDto'
import type { KpiMasterDto } from '../../dto/catalogs/KpiMasterDto'
import type { ConversionMasterDto } from '../../dto/catalogs/ConversionMasterDto'
import type { SaveInitiativeDto } from '../../dto/initiatives/SaveInitiativeDto'
import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { RuleActor } from '../../../domain/initiatives/services/initiativePolicy'
import type { MonthRef } from '../../../domain/initiatives/value-objects/MonthRef'
import { createInitiative } from './createInitiative'
import { updateInitiative } from './updateInitiative'
import { saveInitiativeComponents } from '../initiative-components/saveInitiativeComponents'
import { getInitiativeComponents } from '../initiative-components/getInitiativeComponents'
import { saveKpiValues } from '../initiative-values/saveKpiValues'
import { saveComponentValues } from '../initiative-values/saveComponentValues'
import { saveConversionValues } from '../initiative-values/saveConversionValues'
import { calculateInitiative } from '../calculation/calculateInitiative'
import {
  buildConversionValueGridRows,
  buildFixedValueGridRows,
  buildKpiValueGridRows,
  toSaveComponentValueDtos,
  toSaveConversionValueDtos,
  toSaveKpiValueDtos,
  type MonthlyInputMap,
} from '../../mappers/initiatives/initiativeValueMappers'
import type { InitiativeComponentDraftDto } from '../../mappers/initiatives/initiativeComponentMappers'
import type { Scenario } from '../../../domain/initiatives/value-objects/Scenario'

export type SaveInitiativeAggregateStep =
  | 'initiative'
  | 'components'
  | 'values_kpi'
  | 'values_fixed'
  | 'values_conversion'
  | 'calculation'

const saveStepLabels: Record<SaveInitiativeAggregateStep, string> = {
  initiative: 'Iniciativa',
  components: 'Componentes',
  values_kpi: 'Valores KPI',
  values_fixed: 'Valores fixos',
  values_conversion: 'Valores de conversão',
  calculation: 'Cálculo final',
}

export class SaveInitiativeAggregateError extends Error {
  readonly step: SaveInitiativeAggregateStep

  constructor(step: SaveInitiativeAggregateStep, cause: unknown) {
    const message = cause instanceof Error ? cause.message : 'Erro inesperado durante o salvamento.'
    super(message)
    this.name = 'SaveInitiativeAggregateError'
    this.step = step
  }

  get stepLabel(): string {
    return saveStepLabels[this.step]
  }
}

type SaveInitiativeAggregateInput = {
  mode: 'create' | 'edit'
  initiative: SaveInitiativeDto
  actor: RuleActor
  components: readonly InitiativeComponentDraftDto[]
  componentCatalog: readonly ComponentMasterDto[]
  kpiCatalog: readonly KpiMasterDto[]
  conversionCatalog: readonly ConversionMasterDto[]
  valuesYear: number
  valuesScenario: Scenario
  kpiValuesByRow: Readonly<Record<string, MonthlyInputMap>>
  fixedValuesByRow: Readonly<Record<string, MonthlyInputMap>>
  conversionValuesByRow: Readonly<Record<string, MonthlyInputMap>>
}

type SaveInitiativeAggregateResult = {
  initiative: InitiativeDetailDto
  calculation: CalculateInitiativeResultDto
}

export async function saveInitiativeAggregate(input: SaveInitiativeAggregateInput): Promise<SaveInitiativeAggregateResult> {
  let savedInitiative: InitiativeDetailDto

  try {
    savedInitiative =
      input.mode === 'create'
        ? await createInitiative(input.initiative, input.actor)
        : await updateInitiative(input.initiative, input.actor)
  } catch (error) {
    throw new SaveInitiativeAggregateError('initiative', error)
  }

  try {
    await saveInitiativeComponents(
      savedInitiative.id,
      input.components,
      input.componentCatalog,
      input.actor,
      savedInitiative.status,
    )
  } catch (error) {
    throw new SaveInitiativeAggregateError('components', error)
  }

  const persistedComponents = await getInitiativeComponents(savedInitiative.id, input.componentCatalog)
  const kpiRows = buildKpiValueGridRows(persistedComponents, input.componentCatalog, input.kpiCatalog)
  const fixedRows = buildFixedValueGridRows(persistedComponents, input.componentCatalog)
  const kpiPayload = toSaveKpiValueDtos(
    savedInitiative.id,
    input.valuesYear,
    input.valuesScenario,
    kpiRows,
    input.kpiValuesByRow,
  )
  const fixedPayload = toSaveComponentValueDtos(
    savedInitiative.id,
    input.valuesYear,
    input.valuesScenario,
    fixedRows,
    input.fixedValuesByRow,
  )
  const conversionRows = buildConversionValueGridRows(persistedComponents, input.conversionCatalog)
  const conversionPayload = toSaveConversionValueDtos(
    savedInitiative.id,
    input.valuesYear,
    input.valuesScenario,
    conversionRows,
    input.conversionValuesByRow,
  )

  try {
    await saveKpiValues(kpiPayload, input.actor, savedInitiative.id)
  } catch (error) {
    throw new SaveInitiativeAggregateError('values_kpi', error)
  }

  try {
    await saveComponentValues(fixedPayload, input.actor, savedInitiative.id)
  } catch (error) {
    throw new SaveInitiativeAggregateError('values_fixed', error)
  }

  try {
    await saveConversionValues(conversionPayload, input.actor, savedInitiative.id, {
      year: input.valuesYear,
      scenario: input.valuesScenario,
    })
  } catch (error) {
    throw new SaveInitiativeAggregateError('values_conversion', error)
  }

  try {
    const calculation = await calculateInitiative({
      initiativeId: savedInitiative.id,
      monthRef: `${input.valuesYear}-01` as MonthRef,
      scenario: input.valuesScenario,
    })

    return {
      initiative: savedInitiative,
      calculation,
    }
  } catch (error) {
    throw new SaveInitiativeAggregateError('calculation', error)
  }
}
