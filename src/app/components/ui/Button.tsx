import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { tokens } from './tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: '#1f2937',
    color: '#ffffff',
    border: '1px solid #1f2937',
  },
  secondary: {
    background: '#f9fbfd',
    color: tokens.colors.textPrimary,
    border: `1px solid ${tokens.colors.borderStrong}`,
  },
  ghost: {
    background: '#f9fbfd',
    color: tokens.colors.textSecondary,
    border: `1px solid ${tokens.colors.border}`,
  },
}

export function Button({ children, variant = 'secondary', style, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      style={{
        borderRadius: tokens.radius.sm,
        padding: `${tokens.spacing.xs - 2}px ${tokens.spacing.sm}px`,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        minHeight: 30,
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
