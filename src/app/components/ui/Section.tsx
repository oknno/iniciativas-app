import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { uiTokens } from './tokens'

type SectionProps = {
  title: string
  subtitle?: string
  children: ReactNode
} & HTMLAttributes<HTMLElement>

const subtitleStyle: CSSProperties = {
  margin: `${uiTokens.spacing.xs}px 0 0`,
  ...uiTokens.typography.caption,
  color: uiTokens.colors.textSecondary,
}

export function Section({ title, subtitle, children, style, ...rest }: SectionProps) {
  return (
    <section style={{ display: 'grid', gap: uiTokens.spacing.sm, ...style }} {...rest}>
      <header>
        <h3 style={{ margin: 0, ...uiTokens.typography.subtitle, color: uiTokens.colors.textPrimary }}>{title}</h3>
        {subtitle ? <p style={subtitleStyle}>{subtitle}</p> : null}
      </header>
      {children}
    </section>
  )
}
