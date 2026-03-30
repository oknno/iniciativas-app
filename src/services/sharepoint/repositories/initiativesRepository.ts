import type { SaveInitiativeDto } from '../../../application/dto/initiatives/SaveInitiativeDto'
import type { InitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { asInitiativeId } from '../../../domain/initiatives/value-objects/InitiativeId'
import { asConversionCode } from '../../../domain/catalogs/value-objects/ConversionCode'
import { asFormulaCode } from '../../../domain/catalogs/value-objects/FormulaCode'
import { asKpiCode } from '../../../domain/catalogs/value-objects/KpiCode'
import type { InitiativeWithAnnualGain } from '../../../application/mappers/initiatives/initiativeMappers'

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const nowIso = () => new Date().toISOString()

let nextId = 4
let nextCode = 4

const newId = (): InitiativeId => {
  const id = `INIT-${String(nextId).padStart(3, '0')}`
  nextId += 1
  return asInitiativeId(id)
}

const newCode = (): string => {
  const code = `CAP-${String(nextCode).padStart(3, '0')}`
  nextCode += 1
  return code
}

const buildCopyCode = (code: string): string => `${code}-COPY-${String(nextCode++).padStart(2, '0')}`

let initiativesState: InitiativeWithAnnualGain[] = [
  {
    id: asInitiativeId('INIT-001'),
    code: 'CAP-001',
    title: 'Plant Energy Optimization',
    description: 'Reduce utility spend in packaging line by optimizing compressor profile.',
    owner: 'Maria Gomez',
    stage: 'ASSESSMENT',
    status: 'IN_REVIEW',
    scenario: 'BASE',
    annualGain: 780000,
    implementationCost: 265000,
    startMonthRef: '2026-01',
    endMonthRef: '2026-12',
    components: [
      {
        id: 'COMP-001',
        initiativeId: asInitiativeId('INIT-001'),
        name: 'Electricity savings',
        componentType: 'ENERGY',
        direction: 1,
        calculationType: 'KPI_BASED',
        kpiCode: asKpiCode('KPI-KWH-SAVED'),
        conversionCode: asConversionCode('CONV-KWH-USD'),
        formulaCode: asFormulaCode('FORMULA-LINEAR-DEFAULT'),
        sortOrder: 1,
      },
      {
        id: 'COMP-002',
        initiativeId: asInitiativeId('INIT-001'),
        name: 'One-time implementation',
        componentType: 'OTHER',
        direction: -1,
        calculationType: 'FIXED',
        fixedValue: 265000,
        sortOrder: 2,
      },
    ],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: asInitiativeId('INIT-002'),
    code: 'CAP-002',
    title: 'Supplier Rebate Redesign',
    description: 'Rebalance rebate terms by category and improve contract governance.',
    owner: 'David Singh',
    stage: 'VALIDATION',
    status: 'APPROVED',
    scenario: 'BEST',
    annualGain: 520000,
    implementationCost: 140000,
    startMonthRef: '2026-02',
    endMonthRef: '2026-12',
    components: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: asInitiativeId('INIT-003'),
    code: 'CAP-003',
    title: 'Packaging Material Right-sizing',
    description: 'Optimize pallet and film specifications for cost and logistics efficiency.',
    owner: 'Nina Patel',
    stage: 'DRAFTING',
    status: 'DRAFT',
    scenario: 'BASE',
    annualGain: 245000,
    implementationCost: 90000,
    startMonthRef: '2026-03',
    endMonthRef: '2026-11',
    components: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
]

const cloneInitiative = (initiative: InitiativeWithAnnualGain): InitiativeWithAnnualGain => structuredClone(initiative)

export const initiativesRepository = {
  async list(): Promise<readonly InitiativeWithAnnualGain[]> {
    await wait(120)
    return initiativesState.map(cloneInitiative)
  },

  async getById(id: InitiativeId): Promise<InitiativeWithAnnualGain | undefined> {
    await wait(80)
    const found = initiativesState.find((initiative) => initiative.id === id)
    return found ? cloneInitiative(found) : undefined
  },

  async create(input: SaveInitiativeDto): Promise<InitiativeWithAnnualGain> {
    await wait(120)

    const created: InitiativeWithAnnualGain = {
      id: newId(),
      code: input.code.trim().length > 0 ? input.code : newCode(),
      title: input.title,
      description: input.description,
      owner: input.owner,
      stage: input.stage,
      status: input.status,
      scenario: input.scenario,
      annualGain: Math.round(input.implementationCost * 2.4),
      implementationCost: input.implementationCost,
      startMonthRef: input.startMonthRef,
      endMonthRef: input.endMonthRef,
      components: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }

    initiativesState = [created, ...initiativesState]
    return cloneInitiative(created)
  },

  async update(input: SaveInitiativeDto): Promise<InitiativeWithAnnualGain> {
    await wait(120)

    if (!input.id) {
      throw new Error('Initiative id is required for update.')
    }

    const current = initiativesState.find((initiative) => initiative.id === input.id)

    if (!current) {
      throw new Error(`Initiative not found: ${input.id}`)
    }

    const updated: InitiativeWithAnnualGain = {
      ...current,
      ...input,
      annualGain: Math.round(input.implementationCost * 2.4),
      updatedAt: nowIso(),
    }

    initiativesState = initiativesState.map((initiative) => (initiative.id === updated.id ? updated : initiative))
    return cloneInitiative(updated)
  },

  async delete(id: InitiativeId): Promise<void> {
    await wait(100)
    initiativesState = initiativesState.filter((initiative) => initiative.id !== id)
  },

  async duplicate(id: InitiativeId): Promise<InitiativeWithAnnualGain> {
    await wait(120)

    const source = initiativesState.find((initiative) => initiative.id === id)

    if (!source) {
      throw new Error(`Initiative not found: ${id}`)
    }

    const duplicateId = newId()

    const duplicated: InitiativeWithAnnualGain = {
      ...source,
      id: duplicateId,
      code: buildCopyCode(source.code),
      title: `${source.title} (Copy)`,
      status: 'DRAFT',
      stage: 'DRAFTING',
      components: source.components.map((component, index) => ({
        ...component,
        id: `${component.id}-COPY-${index + 1}`,
        initiativeId: duplicateId,
      })),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }

    initiativesState = [duplicated, ...initiativesState]
    return cloneInitiative(duplicated)
  },
}
