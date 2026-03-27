import type { ConversionMaster } from '../types/conversion'

const conversionMasterMock: ConversionMaster[] = [
  {
    id: 1,
    title: 'Milhar para Unidade',
    code: 'THOUSAND_TO_UNIT',
    fromUnit: 'k-un',
    toUnit: 'un',
    factor: 1000,
    isActive: true,
  },
  {
    id: 2,
    title: 'Percentual para Fator',
    code: 'PERCENT_TO_FACTOR',
    fromUnit: '%',
    toUnit: 'factor',
    factor: 0.01,
    isActive: true,
  },
]

export async function getConversionMasterCatalog(): Promise<ConversionMaster[]> {
  return Promise.resolve(conversionMasterMock)
}
