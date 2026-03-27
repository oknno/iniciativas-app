import type { InitiativeComponent } from '../types/initiativeComponent'

type InitiativeComponentInput = Omit<InitiativeComponent, 'initiativeId'>

const initiativeComponentsStore = new Map<number, InitiativeComponent[]>([
  [
    1,
    [
      {
        initiativeId: 1,
        componentType: 'FTE_SAVING',
        kpiCode: 'FTE_REDUCTION',
        conversionCode: 'COST_PER_FTE',
        formulaCode: 'MULTIPLIER',
      },
      {
        initiativeId: 1,
        componentType: 'SOFTWARE_COST',
        formulaCode: 'DIRECT_VALUE',
      },
    ],
  ],
])

export async function listInitiativeComponents(
  initiativeId: number,
): Promise<InitiativeComponent[]> {
  return Promise.resolve(initiativeComponentsStore.get(initiativeId) ?? [])
}

export async function createInitiativeComponent(
  initiativeId: number,
  data: InitiativeComponentInput,
): Promise<InitiativeComponent> {
  const currentList = initiativeComponentsStore.get(initiativeId) ?? []
  const newItem: InitiativeComponent = { ...data, initiativeId }

  initiativeComponentsStore.set(initiativeId, [...currentList, newItem])

  return Promise.resolve(newItem)
}

export async function updateInitiativeComponent(
  initiativeId: number,
  index: number,
  data: Partial<InitiativeComponentInput>,
): Promise<InitiativeComponent> {
  const currentList = initiativeComponentsStore.get(initiativeId) ?? []

  if (!currentList[index]) {
    throw new Error('Componente não encontrado para atualização')
  }

  const updatedItem = {
    ...currentList[index],
    ...data,
    initiativeId,
  }

  const updatedList = currentList.map((item, itemIndex) =>
    itemIndex === index ? updatedItem : item,
  )

  initiativeComponentsStore.set(initiativeId, updatedList)

  return Promise.resolve(updatedItem)
}

export async function removeInitiativeComponent(
  initiativeId: number,
  index: number,
): Promise<void> {
  const currentList = initiativeComponentsStore.get(initiativeId) ?? []

  if (!currentList[index]) {
    throw new Error('Componente não encontrado para remoção')
  }

  const updatedList = currentList.filter((_, itemIndex) => itemIndex !== index)

  initiativeComponentsStore.set(initiativeId, updatedList)

  return Promise.resolve()
}
