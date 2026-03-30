import type { Initiative } from '../../types/initiative'
import type { InitiativeRepository } from '../contracts/InitiativeRepository'

const BASE_URL = '/initiatives'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export class ApiInitiativeRepository implements InitiativeRepository {
  async list(): Promise<Initiative[]> {
    const response = await fetch(BASE_URL)
    return handleResponse<Initiative[]>(response)
  }

  async getById(id: Initiative['id']): Promise<Initiative | null> {
    const response = await fetch(`${BASE_URL}/${id}`)

    if (response.status === 404) {
      return null
    }

    return handleResponse<Initiative>(response)
  }

  async create(data: Omit<Initiative, 'id'>): Promise<Initiative> {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return handleResponse<Initiative>(response)
  }

  async update(
    id: Initiative['id'],
    data: Partial<Omit<Initiative, 'id'>>,
  ): Promise<Initiative> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return handleResponse<Initiative>(response)
  }

  async remove(id: Initiative['id']): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })

    await handleResponse<void>(response)
  }
}
