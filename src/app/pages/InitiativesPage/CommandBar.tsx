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
        padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px 0`,
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
          padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tokens.colors.textPrimary }}>
            CAPEX Initiatives Core System
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 500, color: tokens.colors.textMuted }}>
            Portfolio overview ({totalItems} initiatives)
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs }}>
            <Button variant="secondary" onClick={onRefresh} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.xs,
              borderLeft: `1px solid ${tokens.colors.borderStrong}`,
              paddingLeft: tokens.spacing.sm,
            }}
          >
            <Button variant="primary" onClick={onNew}>
              Novo
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
        </div>
      </Card>
    </div>
  )
}
