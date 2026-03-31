import type { CSSProperties } from 'react'
import { uiTokens } from '../../components/ui/tokens'

export const styles: Record<string, CSSProperties> = {
  pageFrame: {
    background: '#ffffff',
    border: '1px solid #dde3ea',
    borderRadius: 12,
    padding: uiTokens.spacing.md,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    height: 'calc(100vh - 48px)',
    maxHeight: 'calc(100vh - 48px)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  mainGrid: {
    marginTop: uiTokens.spacing.md,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
    gap: uiTokens.spacing.md,
    alignItems: 'stretch',
    flex: 1,
    minHeight: 0,
  },
  leftColumn: {
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
  },
  rightColumn: {
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
  },
  summaryPanel: {
    border: `1px solid ${uiTokens.colors.border}`,
    borderRadius: 10,
    background: uiTokens.colors.surface,
    padding: uiTokens.spacing.md,
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
  },
}
