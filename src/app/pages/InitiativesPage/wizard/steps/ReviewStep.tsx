import { Card } from '../../../../components/ui/Card'
import { Section } from '../../../../components/ui/Section'
import { uiTokens } from '../../../../components/ui/tokens'
import type { CalculateInitiativeResultDto } from '../../../../../application/dto/calculation/CalculateInitiativeResultDto'
import type { InitiativeDetailDto } from '../../../../../application/dto/initiatives/InitiativeDetailDto'
import { ReviewCalculationPanel } from '../sections/ReviewCalculationPanel'
import { ReviewConfigurationPanel } from '../sections/ReviewConfigurationPanel'

type ReviewStepProps = {
  selectedInitiative?: InitiativeDetailDto
  calculation: CalculateInitiativeResultDto
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewStep({ selectedInitiative, calculation, componentsCount, kpiRowsCount, fixedRowsCount }: ReviewStepProps) {
  return (
    <div style={{ display: 'grid', gap: uiTokens.spacing.md }}>
      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="4.1 Configuração" subtitle={`Iniciativa: ${selectedInitiative?.unidade ?? 'Nova iniciativa'}`}>
          <ReviewConfigurationPanel componentsCount={componentsCount} kpiRowsCount={kpiRowsCount} fixedRowsCount={fixedRowsCount} />
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="4.2 Resultado Mensal" subtitle="Consolidação mensal do ganho projetado.">
          <ReviewCalculationPanel calculation={calculation} mode="monthly" />
        </Section>
      </Card>

      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="4.3 Detalhamento do Cálculo" subtitle="Rastro detalhado por componente, fórmula e mês.">
          <ReviewCalculationPanel calculation={calculation} mode="details" />
        </Section>
      </Card>
    </div>
  )
}
