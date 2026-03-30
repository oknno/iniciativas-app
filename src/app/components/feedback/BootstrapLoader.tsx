import { tokens } from '../ui/tokens'

type BootstrapLoaderProps = {
  title: string
  message?: string
}

export function BootstrapLoader({ title, message }: BootstrapLoaderProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: tokens.colors.background,
      }}
    >
      <div
        style={{
          width: 420,
          background: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.md,
          boxShadow: tokens.shadow.md,
          padding: tokens.spacing.xl,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, color: tokens.colors.textPrimary }}>{title}</h1>
        <p style={{ margin: '8px 0 16px', color: tokens.colors.textSecondary, fontSize: 14 }}>
          {message ?? 'Loading...'}
        </p>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            overflow: 'hidden',
            background: '#e5e7eb',
          }}
        >
          <div
            style={{
              width: '35%',
              height: '100%',
              borderRadius: 999,
              background: tokens.colors.accent,
            }}
          />
        </div>
      </div>
    </div>
  )
}
