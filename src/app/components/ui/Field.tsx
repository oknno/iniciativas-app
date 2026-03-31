import type { CSSProperties, ReactNode } from 'react'
import { uiTokens } from './tokens'

type FieldProps = {
  label: string
  value?: ReactNode
  children?: ReactNode
  layout?: 'inline' | 'stacked'
}

const base: CSSProperties = {
  display: 'grid',
  alignItems: 'center',
  columnGap: uiTokens.spacing.md,
  rowGap: uiTokens.spacing.xs,
}

export function Field({ label, value, children, layout = 'stacked' }: FieldProps) {
  const inline = layout === 'inline'
  return (
    <div style={{ ...base, gridTemplateColumns: inline ? '1fr auto' : '1fr' }}>
      <span style={{ ...uiTokens.typography.caption, color: uiTokens.colors.textMuted }}>{label}</span>
      <span style={{ ...uiTokens.typography.body, color: uiTokens.colors.textSecondary, textAlign: inline ? 'right' : 'left' }}>
        {children ?? value}
      </span>
    </div>
  )
}
