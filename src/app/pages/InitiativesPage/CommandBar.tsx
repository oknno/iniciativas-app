import type { CSSProperties } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { uiTokens } from '../../components/ui/tokens'

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

const styles: Record<string, CSSProperties> = {
  root: {
    position: 'sticky',
    top: 0,
    zIndex: uiTokens.zIndex.sticky,
    background: uiTokens.colors.background,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: uiTokens.spacing.md,
    padding: `${uiTokens.spacing.sm}px ${uiTokens.spacing.md}px`,
  },
  title: { margin: 0, ...uiTokens.typography.title, color: uiTokens.colors.textPrimary },
  actionsRow: { display: 'flex', alignItems: 'center', gap: uiTokens.spacing.xs },
  divider: {
    height: 20,
    width: 1,
    background: uiTokens.colors.borderStrong,
    margin: `0 ${uiTokens.spacing.xs}px`,
  },
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
    <div style={styles.root}>
      <div className="initiatives-container" style={{ paddingTop: uiTokens.spacing.sm, paddingBottom: 0 }}>
        <Card style={styles.card}>
          <h1 style={styles.title}>CAPEX Initiatives ({totalItems})</h1>

          <div style={styles.actionsRow}>
            <Button onClick={onRefresh} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <span style={styles.divider} />
            <Button tone="primary" onClick={onNew}>
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
        </Card>
      </div>
    </div>
  )
}
