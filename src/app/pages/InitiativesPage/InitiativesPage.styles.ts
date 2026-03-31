import type { CSSProperties } from 'react'
import { tokens } from '../../components/ui/tokens'

export const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: tokens.colors.background,
    color: tokens.colors.textPrimary,
  },
  content: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px ${tokens.spacing.lg}px`,
  },
  mainGrid: {
    marginTop: tokens.spacing.lg,
    display: 'grid',
    gridTemplateColumns: '1.65fr 1fr',
    gap: tokens.spacing.lg,
    alignItems: 'start',
  },
}
