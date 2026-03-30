import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useToast } from '../../components/notifications/useToast'
import { tokens } from '../../components/ui/tokens'

type CommandBarProps = {
  totalItems: number
}

export function CommandBar({ totalItems }: CommandBarProps) {
  const { pushToast } = useToast()

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: tokens.zIndex.sticky,
        padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px 0`,
        background: tokens.colors.background,
      }}
    >
      <Card
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: tokens.spacing.md,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Initiatives Core System</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: tokens.colors.textSecondary }}>
            Portfolio overview ({totalItems} initiatives)
          </p>
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
          <Button
            variant="secondary"
            onClick={() => pushToast({ title: 'Refresh queued', message: 'Data refresh will be available soon.' })}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              pushToast({
                title: 'Create initiative',
                message: 'Wizard foundation will be implemented in the next step.',
                tone: 'success',
              })
            }
          >
            New Initiative
          </Button>
        </div>
      </Card>
    </div>
  )
}
