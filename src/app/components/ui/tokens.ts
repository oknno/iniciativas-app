export const tokens = {
  colors: {
    background: '#eef2f6',
    surface: '#ffffff',
    surfaceMuted: '#f9fafb',
    border: '#e5e7eb',
    borderStrong: '#d1d5db',
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    accent: '#1f4f8a',
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
    sm: 10,
    md: 12,
    lg: 16,
    xl: 22,
  },
  radius: {
    sm: 3,
    md: 4,
    lg: 6,
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
