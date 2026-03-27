import type { FormulaMaster } from '../types/formula'

const formulaMasterMock: FormulaMaster[] = [
  {
    id: 1,
    title: 'Multiplicador',
    code: 'MULTIPLIER',
    type: 'MULTIPLY',
    expression: 'valor_base * fator',
    isActive: true,
  },
  {
    id: 2,
    title: 'Valor Direto',
    code: 'DIRECT_VALUE',
    type: 'CUSTOM',
    expression: 'valor_informado',
    isActive: true,
  },
]

export async function getFormulaMasterCatalog(): Promise<FormulaMaster[]> {
  return Promise.resolve(formulaMasterMock)
}
