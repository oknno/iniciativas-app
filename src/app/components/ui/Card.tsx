import type { HTMLAttributes, ReactNode } from 'react'
import { tokens } from './tokens'

type CardProps = {
  children: ReactNode
  padding?: number
} & HTMLAttributes<HTMLDivElement>

export function Card({ children, padding = tokens.spacing.lg, style, ...rest }: CardProps) {
  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.md,
        boxShadow: 'none',
        padding,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
