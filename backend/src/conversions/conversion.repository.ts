import type { Conversion } from '../common/types.js';

export class ConversionRepository {
  private readonly conversions = new Map<string, Conversion>([
    ['kwh:mwh', { id: 'conv-1', fromUnit: 'kwh', toUnit: 'mwh', factor: 0.001 }],
    ['mwh:mwh', { id: 'conv-2', fromUnit: 'mwh', toUnit: 'mwh', factor: 1 }],
    ['kg:kg', { id: 'conv-3', fromUnit: 'kg', toUnit: 'kg', factor: 1 }],
  ]);

  findByUnits(fromUnit: string, toUnit: string): Conversion | undefined {
    return this.conversions.get(`${fromUnit}:${toUnit}`);
  }
}
