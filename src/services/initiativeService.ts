import type { Initiative } from '../types/initiative'

const initiativesMock: Initiative[] = [
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

export async function getInitiatives(): Promise<Initiative[]> {
  return Promise.resolve(initiativesMock)
}