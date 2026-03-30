export const tokens = {
  colors: {
    background: '#eef2f6',
    surface: '#ffffff',
    border: '#d8dee9',
    borderStrong: '#c7d0dd',
    textPrimary: '#1f2937',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
    accent: '#1d4ed8',
    accentSoft: '#dbeafe',
    successSoft: '#dcfce7',
    successText: '#166534',
    warningSoft: '#fef3c7',
    warningText: '#92400e',
    dangerSoft: '#fee2e2',
    dangerText: '#b91c1c',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 16px rgba(15, 23, 42, 0.08)',
  },
  zIndex: {
    sticky: 20,
    toast: 60,
  },
} as const

export type TokenScale = typeof tokens
