import { useEffect, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { StateMessage } from '../../../components/ui/StateMessage'
import { tokens } from '../../../components/ui/tokens'
import type { InitiativeDetailDto } from '../../../../application/dto/initiatives/InitiativeDetailDto'
import { InitiativeMetricsPanel } from './InitiativeMetricsPanel'
import { InitiativeStatusBadge } from './InitiativeStatusBadge'
import { getCalculationResult } from '../../../../application/use-cases/calculation/getCalculationResult'
import { getInitiativeValues } from '../../../../application/use-cases/initiative-values/getInitiativeValues'

type InitiativeSummarySectionProps = {
  item: InitiativeDetailDto | undefined
}

const stageLabel: Record<InitiativeDetailDto['stage'], string> = {
  DRAFTING: 'Drafting',
  ASSESSMENT: 'Assessment',
  VALIDATION: 'Validation',
  GOVERNANCE_GATE: 'Governance Gate',
}

const scenarioLabel: Record<InitiativeDetailDto['scenario'], string> = {
  BASE: 'Base',
  BEST: 'Best',
  WORST: 'Worst',
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

    void getInitiativeValues(item.id, 2026, item.scenario).then(({ kpiValues, componentValues }) => {
      setKpiRowsCount(kpiValues.length)
      setFixedRowsCount(componentValues.length)
    })
  }, [item])

  if (!item) {
    return <StateMessage title="No initiative selected" description="Select one item to view its summary." />
  }

  return (
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.sm }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{item.title}</h2>
            <p style={{ margin: '6px 0 0', color: tokens.colors.textSecondary, fontSize: 14 }}>
              Code: {item.code} • Responsible: {item.owner}
            </p>
          </div>
          <InitiativeStatusBadge status={item.status} />
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: tokens.colors.textSecondary }}>
          Stage: <strong style={{ color: tokens.colors.textPrimary }}>{stageLabel[item.stage]}</strong>
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: tokens.colors.textSecondary }}>
          Scenario: <strong style={{ color: tokens.colors.textPrimary }}>{scenarioLabel[item.scenario]}</strong>
        </p>
        {item.description ? (
          <p style={{ margin: '8px 0 0', fontSize: 14, color: tokens.colors.textSecondary }}>{item.description}</p>
        ) : null}
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
