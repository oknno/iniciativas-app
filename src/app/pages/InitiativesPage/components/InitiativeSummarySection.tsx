import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { Field } from '../../../components/ui/Field'
import { Section } from '../../../components/ui/Section'
import { StateMessage } from '../../../components/ui/StateMessage'
import { uiTokens } from '../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import { InitiativeMetricsPanel } from './InitiativeMetricsPanel'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'
import { getCalculationResult } from '../../../../application/use-cases/calculation/getCalculationResult'
import { getInitiativeValues } from '../../../../application/use-cases/initiative-values/getInitiativeValues'

type InitiativeSummarySectionProps = {
  item: InitiativeDetailDto | undefined
}

export function InitiativeSummarySection({ item }: InitiativeSummarySectionProps) {
  const [annualCalculatedGain, setAnnualCalculatedGain] = useState<number>(0)
  const [kpiRowsCount, setKpiRowsCount] = useState<number>(0)
  const [fixedRowsCount, setFixedRowsCount] = useState<number>(0)

  useEffect(() => {
    if (!item) {
      setAnnualCalculatedGain(0)
      setKpiRowsCount(0)
      setFixedRowsCount(0)
      return
    }

    void getCalculationResult(item.id).then((results) => {
      setAnnualCalculatedGain(results.reduce((sum, result) => sum + result.gainValue, 0))
    })

    void getInitiativeValues(item.id, 2026, 'BASE').then(({ kpiValues, componentValues }) => {
      setKpiRowsCount(kpiValues.length)
      setFixedRowsCount(componentValues.length)
    })
  }, [item])

  if (!item) {
    return <StateMessage title="No initiative selected" description="Select one item to view its summary." />
  }

  return (
    <div style={{ display: 'grid', gap: uiTokens.spacing.lg }}>
      <Card>
        <Section title={item.title}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: uiTokens.spacing.sm }}>
            <span style={{ ...uiTokens.typography.caption, color: uiTokens.colors.textSecondary }}>Initiative status</span>
            <InitiativeStatusBadge status={item.status} />
          </div>

          <div style={{ borderTop: `1px solid ${uiTokens.colors.border}`, paddingTop: uiTokens.spacing.md, display: 'grid', gap: uiTokens.spacing.sm }}>
            <Field label="Unidade" value={item.unidade} layout="inline" />
            <Field label="Responsável" value={item.responsavel} layout="inline" />
            <Field label="Stage" value={item.stage} layout="inline" />
          </div>

          <div style={{ borderTop: `1px solid ${uiTokens.colors.border}`, paddingTop: uiTokens.spacing.md }}>
            <Section title="Dados complementares">
              <Field label="ID" value={item.id} layout="inline" />
            </Section>
          </div>
        </Section>
      </Card>

      <InitiativeMetricsPanel
        annualCalculatedGain={annualCalculatedGain}
        componentsCount={item.components.length}
        kpiRowsCount={kpiRowsCount}
        fixedRowsCount={fixedRowsCount}
        stage={item.stage}
        status={item.status}
      />
    </div>
  )
}
