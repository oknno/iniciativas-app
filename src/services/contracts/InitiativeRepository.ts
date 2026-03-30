import type { Initiative } from '../../types/initiative'

export interface InitiativeRepository {
  list(): Promise<Initiative[]>
  getById(id: Initiative['id']): Promise<Initiative | null>
  create(data: Omit<Initiative, 'id'>): Promise<Initiative>
  update(
    id: Initiative['id'],
    data: Partial<Omit<Initiative, 'id'>>,
  ): Promise<Initiative>
  remove(id: Initiative['id']): Promise<void>
}
