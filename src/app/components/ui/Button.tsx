import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type ButtonTone = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: ReactNode
  tone?: ButtonTone
  variant?: ButtonTone
} & ButtonHTMLAttributes<HTMLButtonElement>

const toneStyles: Record<ButtonTone, CSSProperties> = {
  primary: {
    background: '#111827',
    color: '#ffffff',
    border: '1px solid #111827',
  },
  secondary: {
    background: '#ffffff',
    color: '#111827',
    border: '1px solid #d1d5db',
  },
  ghost: {
    background: '#ffffff',
    color: '#111827',
    border: '1px solid #d1d5db',
  },
}

const disabledStyles: CSSProperties = {
  opacity: 1,
  color: '#9ca3af',
  borderColor: '#e5e7eb',
  background: '#ffffff',
  cursor: 'not-allowed',
}

export function Button({ children, tone, variant, style, ...rest }: ButtonProps) {
  const resolvedTone = tone ?? variant ?? 'secondary'

  return (
    <button
      type="button"
      style={{
        height: 34,
        padding: '0 14px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...toneStyles[resolvedTone],
        ...(rest.disabled ? disabledStyles : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
