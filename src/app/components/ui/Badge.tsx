import type { CSSProperties, ReactNode } from 'react'
import { tokens } from './tokens'

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

type BadgeProps = {
  tone?: BadgeTone
  children: ReactNode
}

const toneStyles: Record<BadgeTone, CSSProperties> = {
  neutral: { background: '#e5e7eb', color: '#374151' },
  info: { background: tokens.colors.accentSoft, color: '#1e3a8a' },
  success: { background: tokens.colors.successSoft, color: tokens.colors.successText },
  warning: { background: tokens.colors.warningSoft, color: tokens.colors.warningText },
  danger: { background: tokens.colors.dangerSoft, color: tokens.colors.dangerText },
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      style={{
        borderRadius: 999,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.2,
        whiteSpace: 'nowrap',
        ...toneStyles[tone],
      }}
    >
      {children}
    </span>
  )
}
