import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { uiTokens } from './tokens'

type ButtonTone = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  tone?: ButtonTone
  variant?: ButtonTone
} & ButtonHTMLAttributes<HTMLButtonElement>

const toneStyles: Record<ButtonTone, CSSProperties> = {
  primary: {
    background: uiTokens.colors.accent,
    color: uiTokens.colors.surface,
    border: `1px solid ${uiTokens.colors.accent}`,
  },
  secondary: {
    background: uiTokens.colors.surfaceMuted,
    color: uiTokens.colors.textPrimary,
    border: `1px solid ${uiTokens.colors.borderStrong}`,
  },
  ghost: {
    background: uiTokens.colors.surface,
    color: uiTokens.colors.textSecondary,
    border: `1px solid ${uiTokens.colors.border}`,
  },
}

export function Button({ children, tone, variant, style, ...rest }: ButtonProps) {
  const resolvedTone = tone ?? variant ?? 'secondary'

  return (
    <button
      type="button"
      style={{
        borderRadius: uiTokens.radius.sm,
        padding: `${uiTokens.spacing.xs - 2}px ${uiTokens.spacing.sm}px`,
        ...uiTokens.typography.caption,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        minHeight: 30,
        ...toneStyles[resolvedTone],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
