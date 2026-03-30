import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { InitiativeDto } from '../../dto/initiatives/InitiativeDto'
import type { InitiativeListItemDto } from '../../dto/initiatives/InitiativeListItemDto'

export type InitiativeWithAnnualGain = InitiativeDto & {
  readonly annualGain: number
}

export const toInitiativeListItemDto = (initiative: InitiativeWithAnnualGain): InitiativeListItemDto => ({
  id: initiative.id,
  code: initiative.code,
  title: initiative.title,
  owner: initiative.owner,
  stage: initiative.stage,
  status: initiative.status,
  annualGain: initiative.annualGain,
})

export const toInitiativeDetailDto = (initiative: InitiativeWithAnnualGain): InitiativeDetailDto => ({
  id: initiative.id,
  code: initiative.code,
  title: initiative.title,
  description: initiative.description,
  owner: initiative.owner,
  stage: initiative.stage,
  status: initiative.status,
  scenario: initiative.scenario,
  annualGain: initiative.annualGain,
  implementationCost: initiative.implementationCost,
  components: initiative.components,
})
