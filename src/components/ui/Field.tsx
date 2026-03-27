import type { ReactNode } from 'react'

type FieldProps = {
  label: string
  children: ReactNode
}

export function Field({ label, children }: FieldProps) {
  return (
    <div className="ui-field">
      <span className="ui-field__label">{label}</span>
      <div className="ui-field__value">{children}</div>
    </div>
  )
}
