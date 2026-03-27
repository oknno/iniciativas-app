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
  },
  {
    id: 2,
    title: 'Redução Consumo Energia Forno',
    unidade: 'Operação',
    responsavel: 'João Silva',
    stage: 'L2',
    status: 'Em validação',
  },
  {
    id: 3,
    title: 'Aumento Produção Laminador',
    unidade: 'Laminação',
    responsavel: 'Maria Souza',
    stage: 'L3',
    status: 'Concluída',
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
