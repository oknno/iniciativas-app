export const resolveMissingKpiValue = (): number => 0

export const resolveMissingFixedValue = (): number => 0

export const resolveMissingConversionValue = (conversionCode: string): { value: number; issue: string } => ({
  value: 0,
  issue: `Missing conversion value for ${conversionCode}`,
})
