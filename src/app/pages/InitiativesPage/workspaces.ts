import type { AccessRole } from '../../../services/sharepoint/repositories/accessRepository'
import type { WizardStepId } from './wizard/wizardOptions'

export type WorkspaceId = 'owner' | 'localController' | 'strategicController' | 'admin'

export type WorkspaceConfig = {
  id: WorkspaceId
  title: string
  subtitle: string
  pendingStatuses?: readonly string[]
  wizardStepIds: readonly WizardStepId[]
  commandVisibility: {
    new: boolean
    edit: boolean
    duplicate: boolean
    delete: boolean
    sendToApproval: boolean
    backStatus: boolean
  }
  sendActionLabel?: string
  backActionLabel?: string
}

const OWNER_WORKSPACE: WorkspaceConfig = {
  id: 'owner',
  title: 'OwnerWorkspace',
  subtitle: 'Cadastro, KPI, custos fixos e envio para validação local.',
  pendingStatuses: ['DRAFT_OWNER', 'RETURNED_TO_OWNER'],
  wizardStepIds: ['initiative', 'components', 'values', 'review'],
  commandVisibility: {
    new: true,
    edit: true,
    duplicate: true,
    delete: true,
    sendToApproval: true,
    backStatus: false,
  },
  sendActionLabel: 'Enviar p/ Local',
}

const LOCAL_CONTROLLER_WORKSPACE: WorkspaceConfig = {
  id: 'localController',
  title: 'LocalControllerWorkspace',
  subtitle: 'Fila de validação local e preparação para conversão estratégica.',
  pendingStatuses: ['IN_REVIEW_LOCAL', 'LOCAL_APPROVED'],
  wizardStepIds: ['components', 'values', 'review'],
  commandVisibility: {
    new: false,
    edit: true,
    duplicate: false,
    delete: false,
    sendToApproval: true,
    backStatus: true,
  },
  sendActionLabel: 'Aprovar local / Enviar p/ Estratégica',
  backActionLabel: 'Devolver p/ Owner',
}

const STRATEGIC_CONTROLLER_WORKSPACE: WorkspaceConfig = {
  id: 'strategicController',
  title: 'StrategicControllerWorkspace',
  subtitle: 'Validação final e decisão estratégica.',
  pendingStatuses: ['IN_REVIEW_STRATEGIC'],
  wizardStepIds: ['review'],
  commandVisibility: {
    new: false,
    edit: false,
    duplicate: false,
    delete: false,
    sendToApproval: true,
    backStatus: true,
  },
  sendActionLabel: 'Aprovar estratégica',
  backActionLabel: 'Rejeitar estratégica',
}

const ADMIN_WORKSPACE: WorkspaceConfig = {
  id: 'admin',
  title: 'DEV/Admin Workspace',
  subtitle: 'Visão completa de suporte com acesso aos fluxos de ponta a ponta.',
  wizardStepIds: ['initiative', 'components', 'values', 'review'],
  commandVisibility: {
    new: true,
    edit: true,
    duplicate: true,
    delete: true,
    sendToApproval: true,
    backStatus: true,
  },
  sendActionLabel: 'Avançar status',
  backActionLabel: 'Voltar status',
}

export const resolveWorkspaceByRole = (role?: AccessRole): WorkspaceConfig => {
  if (role === 'OWNER') {
    return OWNER_WORKSPACE
  }

  if (role === 'CTRL_LOCAL') {
    return LOCAL_CONTROLLER_WORKSPACE
  }

  if (role === 'CTRL_ESTRATEGICA') {
    return STRATEGIC_CONTROLLER_WORKSPACE
  }

  return ADMIN_WORKSPACE
}
