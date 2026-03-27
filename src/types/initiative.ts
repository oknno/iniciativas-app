export type InitiativeStage = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export type InitiativeStatus = 'Ativa' | 'Em validação' | 'Concluída'

export interface Initiative {
  id: number
  title: string
  unidade: string
  responsavel: string
  stage: InitiativeStage
  status: InitiativeStatus
}