import type { ComponentMaster } from './component'
import type { ConversionMaster } from './conversion'
import type { FormulaMaster } from './formula'
import type { KpiMaster } from './kpi'

export type InitiativeStage = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export type InitiativeStatus = 'Ativa' | 'Em validação' | 'Concluída' | 'Em aprovação'

export interface Initiative {
  id: number
  title: string
  unidade: string
  responsavel: string
  stage: InitiativeStage
  status: InitiativeStatus
  budget?: number
  approvalYear?: number
  startDate?: string
  endDate?: string
  businessNeed?: string
  proposedSolution?: string
}

export interface InitiativeComponent {
  id: number
  initiativeId: number
  componentId: number
  formulaId?: number
  conversionId?: number
  order?: number
  component?: ComponentMaster
  formula?: FormulaMaster
  conversion?: ConversionMaster
  created?: string
  modified?: string
}

export interface KpiValue {
  id?: number
  initiativeId: number
  kpiId: number
  period: string
  value: number
  kpi?: KpiMaster
  created?: string
  modified?: string
}

export interface ComponentValue {
  id?: number
  initiativeId: number
  componentId: number
  period: string
  value: number
  component?: ComponentMaster
  created?: string
  modified?: string
}

export interface ConversionValue {
  id?: number
  initiativeId: number
  conversionId: number
  period: string
  value: number
  conversion?: ConversionMaster
  created?: string
  modified?: string
}

export interface CalculationResult {
  initiativeId: number
  period: string
  componentId: number
  calculationType: ComponentMaster['calculationType']
  rawValue: number
  convertedValue?: number
  finalValue: number
}
