import { Card } from './Card'
import { tokens } from './tokens'

type StateMessageProps = {
  title: string
  description?: string
}

export function StateMessage({ title, description }: StateMessageProps) {
  return (
    <Card
      style={{
        textAlign: 'center',
        color: tokens.colors.textSecondary,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, color: tokens.colors.textPrimary }}>{title}</h3>
      {description ? <p style={{ margin: '8px 0 0', fontSize: 14 }}>{description}</p> : null}
    </Card>
  )
}
