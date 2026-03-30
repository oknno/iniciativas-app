import type { Initiative } from '../../types/initiative'
import type { InitiativeRepository } from '../contracts/InitiativeRepository'

const seedInitiatives: Initiative[] = [
  {
    id: 1,
    title: 'Automação Laminação',
    unidade: 'Barra Mansa',
    responsavel: 'Matheus Okano',
    stage: 'L2',
    status: 'Em preenchimento',
    budget: 850000,
    estimatedTotal: 850000,
    accumulatedGain: 265000,
    componentsCount: 6,
    approvalYear: 2025,
    startDate: '2025-05-01',
    endDate: '2026-12-31',
    updatedAt: '2026-03-25',
    businessNeed: 'Reduzir perdas operacionais na laminação e estabilizar variabilidade.',
    proposedSolution: 'Automação de ajustes com telemetria e monitoramento contínuo.',
  },
  {
    id: 2,
    title: 'Eficiência Energética Forno',
    unidade: 'Juiz de Fora',
    responsavel: 'Ana Souza',
    stage: 'L2',
    status: 'Em revisão',
    budget: 1450000,
    estimatedTotal: 1450000,
    accumulatedGain: 484000,
    componentsCount: 8,
    approvalYear: 2024,
    startDate: '2024-02-15',
    endDate: '2026-11-30',
    updatedAt: '2026-03-26',
    businessNeed: 'Controlar o custo energético e reduzir variação de consumo em picos.',
    proposedSolution: 'Modelo preditivo de setpoint e ajustes operacionais em tempo real.',
  },
  {
    id: 3,
    title: 'Redução de Custos Logísticos',
    unidade: 'Piracicaba',
    responsavel: 'Carlos Lima',
    stage: 'L3',
    status: 'Aprovada',
    budget: 2100000,
    estimatedTotal: 2100000,
    accumulatedGain: 1280000,
    componentsCount: 12,
    approvalYear: 2023,
    startDate: '2023-06-01',
    endDate: '2025-10-20',
    updatedAt: '2026-03-21',
    businessNeed: 'Reduzir custos com frete e aumentar previsibilidade da operação.',
    proposedSolution: 'Roteirização inteligente integrada com malha de distribuição.',
  },
  {
    id: 4,
    title: 'Otimização de Produção',
    unidade: 'Sabará',
    responsavel: 'Fernanda Rocha',
    stage: 'L1',
    status: 'Rascunho',
    budget: 690000,
    estimatedTotal: 690000,
    accumulatedGain: 98000,
    componentsCount: 4,
    approvalYear: 2026,
    startDate: '2026-01-10',
    endDate: '2027-03-30',
    updatedAt: '2026-03-28',
    businessNeed: 'Melhorar balanceamento de linha para reduzir gargalos.',
    proposedSolution: 'Sequenciamento dinâmico com suporte analítico para tomada de decisão.',
  },
]

export class MockInitiativeRepository implements InitiativeRepository {
  private initiatives: Initiative[] = [...seedInitiatives]

  async list(): Promise<Initiative[]> {
    return [...this.initiatives]
  }

  async getById(id: Initiative['id']): Promise<Initiative | null> {
    return this.initiatives.find((initiative) => initiative.id === id) ?? null
  }

  async create(data: Omit<Initiative, 'id'>): Promise<Initiative> {
    const nextId =
      this.initiatives.length > 0
        ? Math.max(...this.initiatives.map((initiative) => initiative.id)) + 1
        : 1

    const initiative: Initiative = {
      id: nextId,
      ...data,
    }

    this.initiatives.push(initiative)

    return initiative
  }

  async update(
    id: Initiative['id'],
    data: Partial<Omit<Initiative, 'id'>>,
  ): Promise<Initiative> {
    const index = this.initiatives.findIndex((initiative) => initiative.id === id)

    if (index === -1) {
      throw new Error(`Initiative with id ${id} not found`)
    }

    const updated = {
      ...this.initiatives[index],
      ...data,
      id,
    }

    this.initiatives[index] = updated

    return updated
  }

  async remove(id: Initiative['id']): Promise<void> {
    const initialLength = this.initiatives.length

    this.initiatives = this.initiatives.filter((initiative) => initiative.id !== id)

    if (this.initiatives.length === initialLength) {
      throw new Error(`Initiative with id ${id} not found`)
    }
  }
}
