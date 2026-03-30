import type { CSSProperties, ReactNode } from 'react'
import { uiTokens, type BadgeTone } from './uiTokens'

export function Card({ children, style }: { children: ReactNode, style?: CSSProperties }) {
  return (
    <div
      style={{
        background: uiTokens.colors.surface,
        border: `1px solid ${uiTokens.colors.borderDefault}`,
        borderRadius: uiTokens.radius.card,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  tone?: 'default' | 'primary' | 'danger'
  disabled?: boolean
  onClick?: () => void
  style?: CSSProperties
}

export function Button({ children, type = 'button', tone = 'default', disabled, onClick, style }: ButtonProps) {
  const toneStyle: Record<NonNullable<ButtonProps['tone']>, CSSProperties> = {
    default: { background: uiTokens.colors.surface, color: uiTokens.colors.textStrong, borderColor: uiTokens.colors.borderDefault },
    primary: { background: uiTokens.colors.primary, color: uiTokens.colors.onPrimary, borderColor: uiTokens.colors.primary },
    danger: { background: uiTokens.colors.errorBadgeBg, color: uiTokens.colors.errorBadgeText, borderColor: uiTokens.colors.errorBadgeBorder },
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        appearance: 'none',
        border: `1px solid ${uiTokens.colors.borderDefault}`,
        borderRadius: uiTokens.radius.control,
        padding: `${uiTokens.spacing.xs} ${uiTokens.spacing.md}`,
        minHeight: '30px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontSize: uiTokens.typography.xs,
        fontWeight: uiTokens.typography.strongWeight,
        ...toneStyle[tone],
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone, children: ReactNode }) {
  const toneStyle: Record<BadgeTone, CSSProperties> = {
    neutral: { background: uiTokens.colors.neutralBadgeBg, color: uiTokens.colors.neutralBadgeText, borderColor: uiTokens.colors.borderDefault },
    info: { background: uiTokens.colors.infoBadgeBg, color: uiTokens.colors.infoBadgeText, borderColor: uiTokens.colors.infoBadgeBorder },
    success: { background: uiTokens.colors.successBadgeBg, color: uiTokens.colors.successBadgeText, borderColor: uiTokens.colors.successBadgeBorder },
    warning: { background: uiTokens.colors.warningBadgeBg, color: uiTokens.colors.warningBadgeText, borderColor: uiTokens.colors.warningBadgeBorder },
    error: { background: uiTokens.colors.errorBadgeBg, color: uiTokens.colors.errorBadgeText, borderColor: uiTokens.colors.errorBadgeBorder },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${uiTokens.spacing.xxs} ${uiTokens.spacing.sm}`,
        borderRadius: uiTokens.radius.pill,
        border: `1px solid ${uiTokens.colors.borderDefault}`,
        fontSize: uiTokens.typography.xs,
        fontWeight: uiTokens.typography.titleWeight,
        whiteSpace: 'nowrap',
        ...toneStyle[tone],
      }}
    >
      {children}
    </span>
  )
}

interface FieldProps {
  label: string
  value?: ReactNode
  inline?: boolean
  children?: ReactNode
}

export function Field({ label, value, inline = false, children }: FieldProps) {
  return (
    <div style={{ display: inline ? 'flex' : 'grid', gridTemplateColumns: inline ? 'minmax(120px, 1fr) 1.4fr' : undefined, gap: uiTokens.spacing.xs, alignItems: inline ? 'baseline' : 'stretch' }}>
      <span style={{ fontSize: uiTokens.typography.xs, color: uiTokens.colors.textMuted, fontWeight: uiTokens.typography.titleWeight }}>{label}</span>
      <div style={{ fontSize: uiTokens.typography.sm, color: uiTokens.colors.textStrong, fontWeight: uiTokens.typography.strongWeight }}>{children ?? value}</div>
    </div>
  )
}

export function Section({ title, children }: { title?: string, children: ReactNode }) {
  return (
    <section style={{ display: 'grid', gap: uiTokens.spacing.sm }}>
      {title && <h2 style={{ margin: 0, fontSize: uiTokens.typography.title, color: uiTokens.colors.textStrong, fontWeight: uiTokens.typography.titleWeight }}>{title}</h2>}
      {children}
    </section>
  )
}

export function StateMessage({ state }: { state: 'loading' | 'empty' | 'error' }) {
  const labels = {
    loading: 'Carregando iniciativas...',
    empty: 'Nenhuma iniciativa encontrada.',
    error: 'Erro ao carregar iniciativas.',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px', padding: uiTokens.spacing.xxl, color: uiTokens.colors.textMuted, fontSize: uiTokens.typography.md }}>
      {labels[state]}
    </div>
  )
}
