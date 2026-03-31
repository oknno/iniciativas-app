import type { CSSProperties, ReactNode } from 'react'
import { uiTokens } from './tokens'

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

type BadgeProps = {
  tone?: BadgeTone
  children: ReactNode
}

const toneStyles: Record<BadgeTone, CSSProperties> = {
  neutral: { background: uiTokens.colors.surfaceMuted, color: uiTokens.colors.textSecondary },
  info: { background: uiTokens.colors.accentSoft, color: uiTokens.colors.accent },
  success: { background: uiTokens.colors.successSoft, color: uiTokens.colors.successText },
  warning: { background: uiTokens.colors.warningSoft, color: uiTokens.colors.warningText },
  danger: { background: uiTokens.colors.dangerSoft, color: uiTokens.colors.dangerText },
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      style={{
        borderRadius: uiTokens.radius.sm,
        padding: `1px ${uiTokens.spacing.xs}px`,
        ...uiTokens.typography.overline,
        border: `1px solid ${uiTokens.colors.border}`,
        whiteSpace: 'nowrap',
        ...toneStyles[tone],
      }}
    >
      {children}
    </span>
  )
}
