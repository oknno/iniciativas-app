import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { tokens } from './tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: tokens.colors.accent,
    color: '#ffffff',
    border: `1px solid ${tokens.colors.accent}`,
  },
  secondary: {
    background: tokens.colors.surface,
    color: tokens.colors.textPrimary,
    border: `1px solid ${tokens.colors.borderStrong}`,
  },
  ghost: {
    background: 'transparent',
    color: tokens.colors.textSecondary,
    border: `1px solid transparent`,
  },
}

export function Button({ children, variant = 'secondary', style, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      style={{
        borderRadius: tokens.radius.sm,
        padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
