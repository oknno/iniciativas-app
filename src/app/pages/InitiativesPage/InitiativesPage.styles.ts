import type { CSSProperties } from 'react'
import { uiTokens } from '../../components/ui/tokens'

export const styles: Record<string, CSSProperties> = {
  pageFrame: {
    background: '#ffffff',
    border: '1px solid #dde3ea',
    borderRadius: 12,
    padding: uiTokens.spacing.md,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  },
  mainGrid: {
    marginTop: uiTokens.spacing.md,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
    gap: uiTokens.spacing.md,
    alignItems: 'start',
  },
  leftColumn: {
    minWidth: 0,
  },
  rightColumn: {
    minWidth: 0,
    alignSelf: 'start',
  },
  summaryPanel: {
    border: `1px solid ${uiTokens.colors.border}`,
    borderRadius: 10,
    background: uiTokens.colors.surface,
    padding: uiTokens.spacing.md,
  },
}
