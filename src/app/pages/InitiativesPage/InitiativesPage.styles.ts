import type { CSSProperties } from 'react'
import { uiTokens } from '../../components/ui/tokens'

export const styles: Record<string, CSSProperties> = {
  pageFrame: {
    background: '#ffffff',
    border: '1px solid #dde3ea',
    borderRadius: 12,
    padding: uiTokens.spacing.md,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    height: '100%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    rowGap: uiTokens.spacing.md,
    minHeight: 0,
    overflow: 'hidden',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
    gap: uiTokens.spacing.md,
    alignItems: 'stretch',
    height: '100%',
    minHeight: 0,
  },
  leftColumn: {
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    height: '100%',
  },
  rightColumn: {
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    height: '100%',
  },
  summaryPanel: {
    border: `1px solid ${uiTokens.colors.border}`,
    borderRadius: 10,
    background: uiTokens.colors.surface,
    padding: uiTokens.spacing.md,
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
}
