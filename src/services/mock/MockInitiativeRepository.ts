import type { Initiative } from '../../types/initiative'
import type { InitiativeRepository } from '../contracts/InitiativeRepository'

const seedInitiatives: Initiative[] = [
  {
    id: 1,
    title: 'Automação Processo Administrativo',
    unidade: 'Corporativo',
    responsavel: 'Matheus Okano',
    stage: 'L2',
    status: 'Ativa',
    budget: 850000,
    approvalYear: 2025,
    startDate: '2025-05-01',
    endDate: '2026-12-31',
    businessNeed: 'Reduzir esforço manual em processos administrativos com alto volume.',
    proposedSolution: 'Orquestração de fluxos com RPA e integrações com ERP.',
  },
  {
    id: 2,
    title: 'Redução Consumo Energia Forno',
    unidade: 'Operação',
    responsavel: 'João Silva',
    stage: 'L2',
    status: 'Em validação',
    budget: 1450000,
    approvalYear: 2024,
    startDate: '2024-02-15',
    endDate: '2026-11-30',
    businessNeed: 'Controlar o custo energético e reduzir variação de consumo em picos.',
    proposedSolution: 'Modelo preditivo de setpoint e ajustes operacionais em tempo real.',
  },
  {
    id: 3,
    title: 'Aumento Produção Laminador',
    unidade: 'Laminação',
    responsavel: 'Maria Souza',
    stage: 'L3',
    status: 'Concluída',
    budget: 2100000,
    approvalYear: 2023,
    startDate: '2023-06-01',
    endDate: '2025-10-20',
    businessNeed: 'Elevar produtividade da linha para atender crescimento da demanda.',
    proposedSolution: 'Retrofit de equipamentos críticos e plano de manutenção assistida por dados.',
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
