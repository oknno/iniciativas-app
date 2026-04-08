import { Card } from '../../../components/ui/Card'
import { StateMessage } from '../../../components/ui/StateMessage'
import { uiTokens } from '../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import { validateComponentConfiguration } from '../../../../domain/calculation/services/calculationValidator'

type StagePendingPanelProps = {
  selectedInitiative?: InitiativeDetailDto
  roleLabel: string
}

type PendingBucket = {
  title: string
  items: readonly string[]
}

const buildPendingBuckets = (initiative?: InitiativeDetailDto): readonly PendingBucket[] => {
  if (!initiative) {
    return []
  }

  const missingFields: string[] = []

  if (!initiative.title.trim()) {
    missingFields.push('Título da iniciativa não informado.')
  }
  if (!initiative.unidade.trim()) {
    missingFields.push('Unidade responsável não informada.')
  }
  if (!initiative.responsavel.trim()) {
    missingFields.push('Responsável da iniciativa não informado.')
  }
  if (!initiative.stage.trim()) {
    missingFields.push('Stage da iniciativa não informado.')
  }

  const pendingConversions = initiative.components
    .filter((component) => component.calculationType === 'KPI_BASED' && !component.conversionCode)
    .map((component) => `Componente "${component.name}" sem conversão associada.`)

  const calculationInconsistencies = initiative.components.flatMap((component) => validateComponentConfiguration(component))

  return [
    { title: 'Campos faltantes', items: missingFields },
    { title: 'Conversões pendentes', items: pendingConversions },
    { title: 'Inconsistências de cálculo', items: calculationInconsistencies },
  ]
}

export function StagePendingPanel({ selectedInitiative, roleLabel }: StagePendingPanelProps) {
  if (!selectedInitiative) {
    return <StateMessage title="Painel de pendências" description="Selecione uma iniciativa para analisar pendências por etapa." />
  }

  const buckets = buildPendingBuckets(selectedInitiative)

  return (
    <Card style={{ borderColor: uiTokens.colors.borderStrong }}>
      <header style={{ marginBottom: uiTokens.spacing.sm }}>
        <h3 style={{ margin: 0, ...uiTokens.typography.subtitle }}>Pendências por etapa</h3>
        <p style={{ margin: 0, ...uiTokens.typography.caption, color: uiTokens.colors.textSecondary }}>
          {roleLabel}: acompanhe somente os bloqueios necessários para a etapa atual.
        </p>
      </header>

      <div style={{ display: 'grid', gap: uiTokens.spacing.sm }}>
        {buckets.map((bucket) => (
          <section key={bucket.title} style={{ borderTop: `1px solid ${uiTokens.colors.border}`, paddingTop: uiTokens.spacing.xs }}>
            <p style={{ margin: 0, ...uiTokens.typography.caption, color: uiTokens.colors.textMuted }}>{bucket.title}</p>
            {bucket.items.length > 0 ? (
              <ul style={{ margin: `${uiTokens.spacing.xs}px 0 0`, paddingLeft: 18 }}>
                {bucket.items.map((item) => (
                  <li key={item} style={{ ...uiTokens.typography.body, color: uiTokens.colors.textSecondary }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: `${uiTokens.spacing.xs}px 0 0`, ...uiTokens.typography.body, color: uiTokens.colors.successText }}>
                Sem pendências nesta etapa.
              </p>
            )}
          </section>
        ))}
      </div>
    </Card>
  )
}
