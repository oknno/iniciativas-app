import type { CSSProperties } from 'react'
import { uiTokens } from '../../components/ui/tokens'

export const styles: Record<string, CSSProperties> = {
  mainGrid: {
    marginTop: uiTokens.spacing.lg,
    display: 'grid',
    gridTemplateColumns: '1.65fr 1fr',
    gap: uiTokens.spacing.lg,
    alignItems: 'start',
  },
}
