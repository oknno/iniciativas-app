import type { InitiativeStatus } from '../entities/InitiativeStatus'
import { isInitiativeStatus, isStatusTransitionAllowed } from '../entities/InitiativeStatus'
import { BusinessRuleError } from '../../shared/errors/BusinessRuleError'

export const USER_ROLES = ['OWNER', 'CTRL_LOCAL', 'CTRL_ESTRATEGICA', 'DEV', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

export type TransitionAction =
  | 'SUBMIT_LOCAL_REVIEW'
  | 'RETURN_TO_OWNER'
  | 'SUBMIT_STRATEGIC_REVIEW'
  | 'APPROVE_STRATEGIC'

export interface RuleActor {
  readonly user: string
  readonly role: UserRole
}

export interface TransitionDecision {
  readonly action: TransitionAction
  readonly targetRole: UserRole
}

export type WorkflowEventType =
  | 'SUBMITTED_LOCAL'
  | 'RETURNED_OWNER'
  | 'SUBMITTED_STRATEGIC'
  | 'APPROVED_STRATEGIC'

export const SYSTEM_ACTOR: RuleActor = {
  user: 'system',
  role: 'ADMIN',
}

const ensureRole = (role: UserRole, allowed: readonly UserRole[], message: string): void => {
  if (!allowed.includes(role)) {
    throw new BusinessRuleError(message)
  }
}

const isFullAccessRole = (role: UserRole): boolean => role === 'DEV' || role === 'ADMIN'

const ensureValidStatus = (status: string): InitiativeStatus => {
  if (!isInitiativeStatus(status)) {
    throw new BusinessRuleError('Transição de status inválida')
  }

  return status
}

const transitionActionMatrix: Readonly<Record<InitiativeStatus, Partial<Record<InitiativeStatus, TransitionDecision>>>> = {
  DRAFT_OWNER: {
    IN_REVIEW_LOCAL: { action: 'SUBMIT_LOCAL_REVIEW', targetRole: 'CTRL_LOCAL' },
  },
  IN_REVIEW_LOCAL: {
    RETURNED_TO_OWNER: { action: 'RETURN_TO_OWNER', targetRole: 'OWNER' },
    IN_REVIEW_STRATEGIC: { action: 'SUBMIT_STRATEGIC_REVIEW', targetRole: 'CTRL_ESTRATEGICA' },
  },
  RETURNED_TO_OWNER: {
    IN_REVIEW_LOCAL: { action: 'SUBMIT_LOCAL_REVIEW', targetRole: 'CTRL_LOCAL' },
  },
  IN_REVIEW_STRATEGIC: {
    RETURNED_TO_OWNER: { action: 'RETURN_TO_OWNER', targetRole: 'OWNER' },
    STRATEGIC_APPROVED: { action: 'APPROVE_STRATEGIC', targetRole: 'CTRL_ESTRATEGICA' },
  },
  STRATEGIC_APPROVED: {},
}

const roleActionPermissions: Readonly<Record<UserRole, readonly TransitionAction[]>> = {
  OWNER: ['SUBMIT_LOCAL_REVIEW'],
  CTRL_LOCAL: ['RETURN_TO_OWNER', 'SUBMIT_STRATEGIC_REVIEW'],
  CTRL_ESTRATEGICA: ['RETURN_TO_OWNER', 'APPROVE_STRATEGIC'],
  DEV: [
    'SUBMIT_LOCAL_REVIEW',
    'RETURN_TO_OWNER',
    'SUBMIT_STRATEGIC_REVIEW',
    'APPROVE_STRATEGIC',
  ],
  ADMIN: [
    'SUBMIT_LOCAL_REVIEW',
    'RETURN_TO_OWNER',
    'SUBMIT_STRATEGIC_REVIEW',
    'APPROVE_STRATEGIC',
  ],
}

const ensureCanExecuteAction = (role: UserRole, action: TransitionAction): void => {
  if (isFullAccessRole(role)) {
    return
  }

  if (!roleActionPermissions[role].includes(action)) {
    throw new BusinessRuleError('Papel atual não pode executar essa ação de status')
  }
}

const resolveTransitionDecision = (from: InitiativeStatus, to: InitiativeStatus): TransitionDecision => {
  const decision = transitionActionMatrix[from][to]

  if (!decision) {
    throw new BusinessRuleError('Transição de status inválida')
  }

  return decision
}

export const toWorkflowEventType = (action: TransitionAction): WorkflowEventType => {
  switch (action) {
    case 'SUBMIT_LOCAL_REVIEW':
      return 'SUBMITTED_LOCAL'
    case 'RETURN_TO_OWNER':
      return 'RETURNED_OWNER'
    case 'SUBMIT_STRATEGIC_REVIEW':
      return 'SUBMITTED_STRATEGIC'
    case 'APPROVE_STRATEGIC':
      return 'APPROVED_STRATEGIC'
  }
}

const INITIAL_STATUS: InitiativeStatus = 'DRAFT_OWNER'

export const InitiativePolicy = {
  getInitialStatus(): InitiativeStatus {
    return INITIAL_STATUS
  },

  ensureValidStatus,

  ensureStatusTransition(from: string, to: string): void {
    const source = ensureValidStatus(from)
    const target = ensureValidStatus(to)

    if (source === target) {
      return
    }

    if (!isStatusTransitionAllowed(source, target)) {
      throw new BusinessRuleError('Transição de status inválida')
    }
  },

  ensureStructureEditable(status: string): void {
    const initiativeStatus = ensureValidStatus(status)
    if (initiativeStatus === 'STRATEGIC_APPROVED') {
      throw new BusinessRuleError('Estrutura não pode ser alterada após aprovação estratégica')
    }
  },

  ensureCanCreateInitiative(role: UserRole): void {
    ensureRole(role, ['OWNER', 'DEV', 'ADMIN'], 'Permissão insuficiente para criar iniciativa')
  },

  ensureCanEditStructure(role: UserRole, status: string): void {
    if (isFullAccessRole(role)) {
      this.ensureStructureEditable(status)
      return
    }

    const initiativeStatus = ensureValidStatus(status)
    if (role === 'OWNER' && (initiativeStatus === 'DRAFT_OWNER' || initiativeStatus === 'RETURNED_TO_OWNER')) {
      return
    }

    if (role === 'CTRL_LOCAL' && initiativeStatus === 'IN_REVIEW_LOCAL') {
      return
    }

    throw new BusinessRuleError('Papel atual não pode editar a estrutura nesta fase')
  },

  ensureCanEditKpiValues(role: UserRole, status: string): void {
    if (isFullAccessRole(role)) {
      return
    }

    const initiativeStatus = ensureValidStatus(status)
    if (role === 'OWNER' && (initiativeStatus === 'DRAFT_OWNER' || initiativeStatus === 'RETURNED_TO_OWNER')) {
      return
    }

    throw new BusinessRuleError('Papel atual não pode editar KPI nesta fase')
  },

  ensureCanEditComponentValues(role: UserRole, status: string): void {
    if (isFullAccessRole(role)) {
      return
    }

    const initiativeStatus = ensureValidStatus(status)
    if (role === 'OWNER' && (initiativeStatus === 'DRAFT_OWNER' || initiativeStatus === 'RETURNED_TO_OWNER')) {
      return
    }

    throw new BusinessRuleError('Papel atual não pode editar custos nesta fase')
  },

  ensureCanEditConversionValues(role: UserRole, status: string): void {
    if (isFullAccessRole(role)) {
      return
    }

    const initiativeStatus = ensureValidStatus(status)
    if (role === 'CTRL_LOCAL' && initiativeStatus === 'IN_REVIEW_LOCAL') {
      return
    }

    throw new BusinessRuleError('Papel atual não pode editar conversões nesta fase')
  },

  ensureCanTransition(role: UserRole, from: string, to: string): TransitionDecision {
    const source = ensureValidStatus(from)
    const target = ensureValidStatus(to)

    if (source === target) {
      throw new BusinessRuleError('Nenhuma mudança de status foi solicitada')
    }

    this.ensureStatusTransition(source, target)

    const decision = resolveTransitionDecision(source, target)
    ensureCanExecuteAction(role, decision.action)

    return decision
  },
}
