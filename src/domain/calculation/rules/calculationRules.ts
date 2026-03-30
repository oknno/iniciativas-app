import type { Direction } from '../../catalogs/value-objects/Direction'

export const applyDirection = (rawValue: number, direction: Direction): number => rawValue * direction

export const sumGainValues = (values: readonly number[]): number => values.reduce((total, value) => total + value, 0)
