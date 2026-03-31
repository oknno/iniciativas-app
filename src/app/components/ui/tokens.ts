export const tokens = {
  colors: {
    background: '#e9edf2',
    surface: '#ffffff',
    surfaceMuted: '#f4f6f9',
    border: '#cfd6df',
    borderStrong: '#b8c3d1',
    textPrimary: '#1b2430',
    textSecondary: '#3f4d5d',
    textMuted: '#5f6b7a',
    accent: '#1f4f8a',
    accentSoft: '#dbe7f5',
    successSoft: '#dcfce7',
    successText: '#166534',
    warningSoft: '#fef3c7',
    warningText: '#92400e',
    dangerSoft: '#fee2e2',
    dangerText: '#b91c1c',
  },
  spacing: {
    xxs: 4,
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
  },
  radius: {
    sm: 4,
    md: 7,
    lg: 10,
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
