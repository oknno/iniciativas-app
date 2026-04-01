import type { InitiativeStatus } from '../entities/InitiativeStatus'
import { isInitiativeStatus, isStatusTransitionAllowed } from '../entities/InitiativeStatus'
import { BusinessRuleError } from '../../shared/errors/BusinessRuleError'

export const USER_ROLES = ['OWNER', 'CONTROLADORIA', 'ESTRATEGIA'] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface RuleActor {
  readonly user: string
  readonly role: UserRole
}

export const SYSTEM_ACTOR: RuleActor = {
  user: 'system',
  role: 'OWNER',
}

const ensureRole = (role: UserRole, allowed: readonly UserRole[], message: string): void => {
  if (!allowed.includes(role)) {
    throw new BusinessRuleError(message)
  }
}

const ensureValidStatus = (status: string): InitiativeStatus => {
  if (!isInitiativeStatus(status)) {
    throw new BusinessRuleError('Transição de status inválida')
  }

  return status
}

export const InitiativePolicy = {
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
    if (initiativeStatus === 'Aprovada') {
      throw new BusinessRuleError('Estrutura não pode ser alterada após aprovação')
    }
  },

  ensureCanCreateInitiative(role: UserRole): void {
    ensureRole(role, ['OWNER'], 'Permissão insuficiente para criar iniciativa')
  },

  ensureCanEditStructure(role: UserRole, status: string): void {
    ensureRole(role, ['OWNER'], 'Estrutura não pode ser alterada após aprovação')
    this.ensureStructureEditable(status)
  },

  ensureCanEditKpiValues(role: UserRole): void {
    ensureRole(role, ['OWNER'], 'Permissão insuficiente para editar valores de KPI')
  },

  ensureCanEditComponentValues(role: UserRole): void {
    ensureRole(role, ['OWNER'], 'Permissão insuficiente para editar valores de componentes')
  },

  ensureCanApprove(role: UserRole): void {
    ensureRole(role, ['ESTRATEGIA'], 'Permissão insuficiente para aprovar iniciativa')
  },

  ensureCanReject(role: UserRole): void {
    ensureRole(role, ['ESTRATEGIA'], 'Permissão insuficiente para reprovar iniciativa')
  },
}
