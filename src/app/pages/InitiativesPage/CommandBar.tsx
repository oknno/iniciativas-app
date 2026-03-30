import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { tokens } from '../../components/ui/tokens'

type CommandBarProps = {
  totalItems: number
  isLoading: boolean
  canEdit: boolean
  canDuplicate: boolean
  canDelete: boolean
  onRefresh: () => void
  onNew: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function CommandBar({
  totalItems,
  isLoading,
  canEdit,
  canDuplicate,
  canDelete,
  onRefresh,
  onNew,
  onEdit,
  onDuplicate,
  onDelete,
}: CommandBarProps) {
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
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Initiatives Core System</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: tokens.colors.textSecondary }}>
            Portfolio overview ({totalItems} initiatives)
          </p>
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="primary" onClick={onNew}>
            New Initiative
          </Button>
          <Button onClick={onEdit} disabled={!canEdit}>
            Edit
          </Button>
          <Button onClick={onDuplicate} disabled={!canDuplicate}>
            Duplicate
          </Button>
          <Button onClick={onDelete} disabled={!canDelete}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  )
}
