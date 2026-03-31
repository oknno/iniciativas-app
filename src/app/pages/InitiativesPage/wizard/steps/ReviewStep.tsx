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
  isCalculating: boolean
  previewErrorMessage?: string | null
  componentsCount: number
  kpiRowsCount: number
  fixedRowsCount: number
}

export function ReviewStep({
  selectedInitiative,
  calculation,
  isCalculating,
  previewErrorMessage,
  componentsCount,
  kpiRowsCount,
  fixedRowsCount,
}: ReviewStepProps) {
  const hasConfigurationIssues = componentsCount === 0 || (kpiRowsCount === 0 && fixedRowsCount === 0)
  const hasCalculationResult = calculation.results.length > 0

  return (
    <div style={{ display: 'grid', gap: uiTokens.spacing.md }}>
      <Card style={{ borderColor: uiTokens.colors.borderStrong, padding: uiTokens.spacing.md }}>
        <Section title="4.0 Status da Revisão" subtitle="Resumo final antes de salvar a iniciativa.">
          <div style={{ display: 'grid', gap: uiTokens.spacing.xs }}>
            <span style={{ ...uiTokens.typography.caption, color: hasConfigurationIssues ? uiTokens.colors.warningText : uiTokens.colors.successText }}>
              {hasConfigurationIssues ? 'Existem pendências de configuração.' : 'Configuração pronta para salvar.'}
            </span>
            <span style={{ ...uiTokens.typography.caption, color: isCalculating ? uiTokens.colors.textMuted : uiTokens.colors.textSecondary }}>
              {isCalculating
                ? 'Atualizando resultado da revisão...'
                : hasCalculationResult
                  ? 'Resultado anual disponível para validação.'
                  : 'Resultado anual ainda não disponível.'}
            </span>
            {previewErrorMessage ? (
              <span style={{ ...uiTokens.typography.caption, color: uiTokens.colors.dangerText }}>{previewErrorMessage}</span>
            ) : null}
          </div>
        </Section>
      </Card>

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
