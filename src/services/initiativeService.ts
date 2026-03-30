import type { Initiative } from '../types/initiative'
import { initiativeRepository } from './index'

export async function getInitiatives(): Promise<Initiative[]> {
  return initiativeRepository.list()
}

export async function getInitiativeById(
  id: Initiative['id'],
): Promise<Initiative | null> {
  return initiativeRepository.getById(id)
}

export async function createInitiative(
  data: Omit<Initiative, 'id'>,
): Promise<Initiative> {
  return initiativeRepository.create(data)
}

export async function updateInitiative(
  id: Initiative['id'],
  data: Partial<Omit<Initiative, 'id'>>,
): Promise<Initiative> {
  return initiativeRepository.update(id, data)
}

export async function removeInitiative(id: Initiative['id']): Promise<void> {
  return initiativeRepository.remove(id)
}
