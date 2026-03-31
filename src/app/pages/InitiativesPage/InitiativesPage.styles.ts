import type { CSSProperties } from 'react'
import { uiTokens } from '../../components/ui/tokens'

export const styles: Record<string, CSSProperties> = {
  mainGrid: {
    marginTop: uiTokens.spacing.md,
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: uiTokens.spacing.md,
    alignItems: 'start',
  },
}
