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
    <div style={{ display: 'grid', gap: tokens.spacing.md }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: tokens.spacing.sm, alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{item.title}</h2>
          </div>
          <InitiativeStatusBadge status={item.status} />
        </div>
        <div style={{ marginTop: tokens.spacing.sm, borderTop: `1px solid ${tokens.colors.border}`, paddingTop: tokens.spacing.sm }}>
          {[
            ['Unidade', item.unidade],
            ['Responsible', item.responsavel],
            ['Stage', item.stage],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: `${tokens.spacing.xs}px 0` }}
            >
              <span style={{ fontWeight: 600, color: tokens.colors.textSecondary }}>{label}</span>
              <span style={{ color: tokens.colors.textPrimary }}>{value}</span>
            </div>
          ))}
        </div>
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
