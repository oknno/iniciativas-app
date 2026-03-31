import type { InitiativeDetailDto } from '../../dto/initiatives/InitiativeDetailDto'
import type { InitiativeDto } from '../../dto/initiatives/InitiativeDto'
import type { InitiativeListItemDto } from '../../dto/initiatives/InitiativeListItemDto'

export type InitiativeWithAnnualGain = InitiativeDto & {
  readonly annualGain: number
}

export const toInitiativeListItemDto = (initiative: InitiativeWithAnnualGain): InitiativeListItemDto => ({
  id: initiative.id,
  title: initiative.title,
  unidade: initiative.unidade,
  responsavel: initiative.responsavel,
  stage: initiative.stage,
  status: initiative.status,
  annualGain: initiative.annualGain,
})

export const toInitiativeDetailDto = (initiative: InitiativeWithAnnualGain): InitiativeDetailDto => ({
  id: initiative.id,
  title: initiative.title,
  unidade: initiative.unidade,
  responsavel: initiative.responsavel,
  stage: initiative.stage,
  status: initiative.status,
  annualGain: initiative.annualGain,
  components: initiative.components,
})
