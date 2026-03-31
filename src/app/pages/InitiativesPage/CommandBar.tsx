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
    paddingTop: uiTokens.spacing.sm,
    background: uiTokens.colors.background,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: uiTokens.spacing.md,
    flexWrap: 'wrap',
    padding: `${uiTokens.spacing.md}px ${uiTokens.spacing.lg}px`,
  },
  title: { margin: 0, ...uiTokens.typography.title, color: uiTokens.colors.textPrimary },
  subtitle: { margin: '2px 0 0', ...uiTokens.typography.caption, color: uiTokens.colors.textMuted },
  actionsRow: { display: 'flex', alignItems: 'center', gap: uiTokens.spacing.sm, flexWrap: 'wrap' },
  actionGroup: { display: 'flex', alignItems: 'center', gap: uiTokens.spacing.xs },
  actionGroupSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: uiTokens.spacing.xs,
    borderLeft: `1px solid ${uiTokens.colors.borderStrong}`,
    paddingLeft: uiTokens.spacing.sm,
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
      <div className="initiatives-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Card style={styles.card}>
          <div>
            <h1 style={styles.title}>CAPEX Initiatives Core System</h1>
            <p style={styles.subtitle}>Portfolio overview ({totalItems} initiatives)</p>
          </div>
          <div style={styles.actionsRow}>
            <div style={styles.actionGroup}>
              <Button onClick={onRefresh} disabled={isLoading}>
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            <div style={styles.actionGroupSecondary}>
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
          </div>
        </Card>
      </div>
    </div>
  )
}
