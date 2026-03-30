export type ConversionCode = string & { readonly __brand: 'ConversionCode' }

export const asConversionCode = (value: string): ConversionCode => value as ConversionCode
