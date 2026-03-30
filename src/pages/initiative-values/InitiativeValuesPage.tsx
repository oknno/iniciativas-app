import { useCallback, useEffect, useState } from 'react'
import { getConversionMasterCatalog } from '../../services/conversionMasterService'
import { listInitiativeComponents } from '../../services/initiativeComponentService'
import { getInitiativeById } from '../../services/initiativeService'
import { getKpiMasterCatalog } from '../../services/kpiMasterService'
import {
  listConversionValues,
  listKpiValues,
  saveConversionValue,
  saveKpiValue,
} from '../../services/valueService'
import type { ConversionMaster } from '../../types/conversion'
import type { InitiativeComponent } from '../../types/initiativeComponent'
import type { Initiative } from '../../types/initiative'
import type { KpiMaster, KPICode } from '../../types/kpi'
import type { ConversionCode } from '../../types/conversion'

interface InitiativeValuesPageProps {
  initiativeId: number
  onBackToInitiatives: () => void
  onOpenComponents: (initiativeId: number) => void
  onOpenResult: (initiativeId: number) => void
}

const MONTHS = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Fev' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Abr' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Ago' },
  { value: 9, label: 'Set' },
  { value: 10, label: 'Out' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dez' },
]

const YEARS = [2024, 2025, 2026]
const SCENARIO_BY_YEAR = {
  2024: 'Histórico (Actual)',
  2025: 'Histórico (Actual)',
  2026: `Realizado até ${MONTHS[new Date().getMonth()]?.label ?? 'mês atual'} + Forecast do restante`,
} as const

export function InitiativeValuesPage({
  initiativeId,
  onBackToInitiatives,
  onOpenComponents,
  onOpenResult,
}: InitiativeValuesPageProps) {
  const [initiative, setInitiative] = useState<Initiative | null>(null)
  const [components, setComponents] = useState<InitiativeComponent[]>([])
  const [kpiCatalog, setKpiCatalog] = useState<KpiMaster[]>([])
  const [conversionCatalog, setConversionCatalog] = useState<ConversionMaster[]>([])

  const [kpiCode, setKpiCode] = useState<KPICode | ''>('')
  const [conversionCode, setConversionCode] = useState<ConversionCode | ''>('')

  const [kpiMatrix, setKpiMatrix] = useState<Record<string, number>>({})
  const [conversionMatrix, setConversionMatrix] = useState<Record<string, number>>({})

  useEffect(() => {
    async function loadData() {
      const [initiativeData, initiativeComponents, kpis, conversions] = await Promise.all([
        getInitiativeById(initiativeId),
        listInitiativeComponents(initiativeId),
        getKpiMasterCatalog(),
        getConversionMasterCatalog(),
      ])

      setInitiative(initiativeData)
      setComponents(initiativeComponents)
      setKpiCatalog(kpis)
      setConversionCatalog(conversions)

      setKpiCode((initiativeComponents.find((item) => item.kpiCode)?.kpiCode as KPICode | undefined) ?? '')
      setConversionCode((initiativeComponents.find((item) => item.conversionCode)?.conversionCode as ConversionCode | undefined) ?? 'COST_PER_FTE')
    }

    void loadData()
  }, [initiativeId])

  const refreshValues = useCallback(async () => {
    const [kpi, conversion] = await Promise.all([
      listKpiValues(initiativeId),
      listConversionValues(),
    ])

    const nextKpiMatrix: Record<string, number> = {}
    const nextConversionMatrix: Record<string, number> = {}

    for (const item of kpi) {
      nextKpiMatrix[`${item.kpiCode}-${item.year}-${item.month}`] = item.value
    }

    for (const item of conversion) {
      nextConversionMatrix[`${item.conversionCode}-${item.year}-${item.month}`] = item.value
    }

    setKpiMatrix(nextKpiMatrix)
    setConversionMatrix(nextConversionMatrix)
  }, [initiativeId])

  useEffect(() => {
    void refreshValues()
  }, [refreshValues])

  const linkedKpis = Array.from(new Set(components.map((component) => component.kpiCode).filter(Boolean)))
  const linkedConversions = components
    .map((component) => component.conversionCode)
    .filter((code): code is ConversionCode => Boolean(code))
  const uniqueLinkedConversions = Array.from(new Set(linkedConversions))

  return (
    <main>
      <header className="capex-topbar">
        <div>
          <h1 style={{ margin: 0 }}>Etapas 2 e 3 de 4 · Compensação/Custo + Valores mensais</h1>
          <p style={{ marginTop: '6px', marginBottom: 0 }}>
            {initiative ? `Iniciativa: ${initiative.title}` : 'Carregando iniciativa...'}
          </p>
          <p style={{ marginTop: '6px', marginBottom: 0, color: '#4b5563' }}>
            Nesta tela você separa custos de compensação e preenche os valores por mês para calcular o líquido final.
          </p>
        </div>

        <div className="capex-topbar-actions">
          <button type="button" className="btn" onClick={() => onOpenComponents(initiativeId)}>
            Voltar para etapa 1
          </button>
          <button type="button" className="btn primary" onClick={() => onOpenResult(initiativeId)}>
            Continuar para etapa 4 (Resultado)
          </button>
          <button type="button" className="btn" onClick={onBackToInitiatives}>
            Voltar para iniciativas
          </button>
        </div>
      </header>

      <section className="flow-stepper">
        <div className="flow-step"><strong>1. KPI/Ganho</strong>Componentes de ganho.</div>
        <div className="flow-step active"><strong>2. Compensação/Custo</strong>Informar custos para viabilizar o ganho.</div>
        <div className="flow-step active"><strong>3. Valores mensais</strong>Preencher 2024-2026 por mês.</div>
        <div className="flow-step"><strong>4. Resultado</strong>Consolidado líquido.</div>
      </section>

      <section className="flow-guidance">
        <strong>Separação obrigatória:</strong> ganho (KPI) é uma coisa; custo de compensação (software, implantação, etc.) é outra.
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>1) KPI mensal (2024 x 2025 x 2026)</h2>
        <label style={labelStyle}>
          KPI
          <select value={kpiCode} onChange={(event) => setKpiCode(event.target.value as KPICode)}>
            <option value="">Selecione KPI...</option>
            {linkedKpis.map((code) => {
              const item = kpiCatalog.find((kpi) => kpi.code === code)
              return <option key={code} value={code}>{item?.title ?? code}</option>
            })}
          </select>
        </label>

        {kpiCode ? (
          <div style={tableWrapperStyle}>
            <table style={matrixTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Ano</th>
                  <th style={thStyle}>Cenário</th>
                  {MONTHS.map((month) => <th key={month.value} style={thStyle}>{month.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {YEARS.map((year) => (
                  <tr key={year}>
                    <td style={tdStyle}>{year}</td>
                    <td style={tdStyle}>{SCENARIO_BY_YEAR[year as keyof typeof SCENARIO_BY_YEAR]}</td>
                    {MONTHS.map((month) => {
                      const key = `${kpiCode}-${year}-${month.value}`
                      return (
                        <td key={key} style={tdStyle}>
                          <input
                            style={cellInputStyle}
                            type="number"
                            step="any"
                            value={kpiMatrix[key] ?? ''}
                            onChange={(event) => {
                              const numericValue = Number(event.target.value)
                              setKpiMatrix((current) => ({ ...current, [key]: numericValue }))
                              void saveKpiValue({ initiativeId, kpiCode, year, month: month.value, value: numericValue })
                            }}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>2) Compensação / custo mensal (varia por ano/mês)</h2>
        <label style={labelStyle}>
          Conversão
          <select value={conversionCode} onChange={(event) => setConversionCode(event.target.value as ConversionCode)}>
            <option value="">Selecione conversão...</option>
            {uniqueLinkedConversions.map((code) => {
              const item = conversionCatalog.find((conversion) => conversion.code === code)
              return <option key={code} value={code}>{item?.title ?? code}</option>
            })}
          </select>
        </label>

        {conversionCode ? (
          <div style={tableWrapperStyle}>
            <table style={matrixTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Ano</th>
                  <th style={thStyle}>Cenário</th>
                  {MONTHS.map((month) => <th key={month.value} style={thStyle}>{month.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {YEARS.map((year) => (
                  <tr key={year}>
                    <td style={tdStyle}>{year}</td>
                    <td style={tdStyle}>{SCENARIO_BY_YEAR[year as keyof typeof SCENARIO_BY_YEAR]}</td>
                    {MONTHS.map((month) => {
                      const key = `${conversionCode}-${year}-${month.value}`
                      return (
                        <td key={key} style={tdStyle}>
                          <input
                            style={cellInputStyle}
                            type="number"
                            step="any"
                            value={conversionMatrix[key] ?? ''}
                            onChange={(event) => {
                              const numericValue = Number(event.target.value)
                              setConversionMatrix((current) => ({ ...current, [key]: numericValue }))
                              void saveConversionValue({ conversionCode, year, month: month.value, value: numericValue })
                            }}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section style={formulaBoxStyle}>
        <strong>Regra de cálculo exibida para o analista</strong>
        <p style={{ margin: '4px 0 0' }}>
          Resultado mensal = Σ (KPI do mês × Conversion Rate do mês × Direção do componente) + componentes FIXED.
        </p>
        <p style={{ margin: '4px 0 0', color: '#4b5563' }}>
          Exemplo de leitura: "2024 tinha X", "2025 evoluiu para Y", "2026 está em Z e forecast W".
        </p>
      </section>
    </main>
  )
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
  background: '#fff',
}

const tableWrapperStyle: React.CSSProperties = {
  overflowX: 'auto',
}

const matrixTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px',
  borderBottom: '1px solid #d1d5db',
  background: '#f8fafc',
  fontSize: '12px',
}

const tdStyle: React.CSSProperties = {
  padding: '6px',
  borderBottom: '1px solid #e5e7eb',
}

const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: '6px',
  marginBottom: '10px',
  maxWidth: '420px',
}

const cellInputStyle: React.CSSProperties = {
  width: '100%',
  minWidth: '58px',
}

const formulaBoxStyle: React.CSSProperties = {
  marginTop: '12px',
  border: '1px dashed #94a3b8',
  borderRadius: '8px',
  padding: '10px',
  background: '#f8fafc',
}
