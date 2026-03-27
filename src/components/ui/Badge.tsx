type BadgeTone = 'neutral' | 'info' | 'success' | 'error' | 'warning'

type BadgeProps = {
  label: string
  tone?: BadgeTone
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return <span className={`ui-badge ui-badge--${tone}`}>{label}</span>
}
