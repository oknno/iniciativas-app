import type { HTMLAttributes, ReactNode } from 'react'
import { uiTokens } from './tokens'

type CardProps = {
  children: ReactNode
  padding?: number
} & HTMLAttributes<HTMLDivElement>

export function Card({ children, padding = uiTokens.spacing.lg, style, ...rest }: CardProps) {
  return (
    <div
      style={{
        background: uiTokens.colors.surface,
        border: `1px solid ${uiTokens.colors.border}`,
        borderRadius: uiTokens.radius.md,
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
