import { useCallback, useEffect, useMemo, useState } from 'react'
import { getComponentMasterCatalog } from '../../services/componentMasterService'
import { getConversionMasterCatalog } from '../../services/conversionMasterService'
import { listInitiativeComponents } from '../../services/initiativeComponentService'
import { getInitiativeById } from '../../services/initiativeService'
import { getKpiMasterCatalog } from '../../services/kpiMasterService'
import {
  listComponentValues,
  listConversionValues,
  listKpiValues,
  saveComponentValue,
  saveConversionValue,
  saveKpiValue,
} from '../../services/valueService'
import type { ComponentMaster } from '../../types/component'
import type { ConversionMaster } from '../../types/conversion'
import type { InitiativeComponent } from '../../types/initiativeComponent'
import type { Initiative } from '../../types/initiative'
import type { KpiMaster, KPICode } from '../../types/kpi'
import type { ComponentTypeCode } from '../../types/component'
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

export function InitiativeValuesPage({
  initiativeId,
  onBackToInitiatives,
  onOpenComponents,
  onOpenResult,
}: InitiativeValuesPageProps) {
  const [initiative, setInitiative] = useState<Initiative | null>(null)
  const [components, setComponents] = useState<InitiativeComponent[]>([])
  const [kpiCatalog, setKpiCatalog] = useState<KpiMaster[]>([])
  const [componentCatalog, setComponentCatalog] = useState<ComponentMaster[]>([])
  const [conversionCatalog, setConversionCatalog] = useState<ConversionMaster[]>([])

  const [kpiCode, setKpiCode] = useState<KPICode | ''>('')
  const [componentType, setComponentType] = useState<ComponentTypeCode | ''>('')
  const [conversionCode, setConversionCode] = useState<ConversionCode | ''>('')

  const [kpiMatrix, setKpiMatrix] = useState<Record<string, number>>({})
  const [componentMatrix, setComponentMatrix] = useState<Record<string, number>>({})
  const [conversionMatrix, setConversionMatrix] = useState<Record<string, number>>({})

  useEffect(() => {
    async function loadData() {
      const [initiativeData, initiativeComponents, kpis, componentMaster, conversions] = await Promise.all([
        getInitiativeById(initiativeId),
        listInitiativeComponents(initiativeId),
        getKpiMasterCatalog(),
        getComponentMasterCatalog(),
        getConversionMasterCatalog(),
      ])

      setInitiative(initiativeData)
      setComponents(initiativeComponents)
      setKpiCatalog(kpis)
      setComponentCatalog(componentMaster)
      setConversionCatalog(conversions)

      setKpiCode((initiativeComponents.find((item) => item.kpiCode)?.kpiCode as KPICode | undefined) ?? '')
      setComponentType((initiativeComponents.find((item) => item.componentType)?.componentType as ComponentTypeCode | undefined) ?? '')
      setConversionCode((initiativeComponents.find((item) => item.conversionCode)?.conversionCode as ConversionCode | undefined) ?? 'COST_PER_FTE')
    }

    void loadData()
  }, [initiativeId])

  const refreshValues = useCallback(async () => {
    const [kpi, component, conversion] = await Promise.all([
      listKpiValues(initiativeId),
      listComponentValues(initiativeId),
      listConversionValues(),
    ])

    const nextKpiMatrix: Record<string, number> = {}
    const nextComponentMatrix: Record<string, number> = {}
    const nextConversionMatrix: Record<string, number> = {}

    for (const item of kpi) {
      nextKpiMatrix[`${item.kpiCode}-${item.year}-${item.month}`] = item.value
    }

    for (const item of component) {
      nextComponentMatrix[`${item.componentType}-${item.year}-${item.month}`] = item.value
    }

    for (const item of conversion) {
      nextConversionMatrix[`${item.conversionCode}-${item.year}-${item.month}`] = item.value
    }

    setKpiMatrix(nextKpiMatrix)
    setComponentMatrix(nextComponentMatrix)
    setConversionMatrix(nextConversionMatrix)
  }, [initiativeId])

  useEffect(() => {
    void refreshValues()
  }, [refreshValues])

  const scenarioByYear = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1
    return {
      2024: 'Histórico (Actual)',
      2025: 'Histórico (Actual)',
      2026: `Realizado até ${MONTHS[currentMonth - 1]?.label ?? 'mês atual'} + Forecast do restante`,
    }
  }, [])

  const linkedKpis = components.map((component) => component.kpiCode).filter(Boolean)
  const linkedComponentTypes = components.map((component) => component.componentType)

  const linkedConversions = components
    .map((component) => component.conversionCode)
    .filter((code): code is ConversionCode => Boolean(code))

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Preenchimento anual e forecast</h1>
      <p>{initiative ? `Iniciativa: ${initiative.title}` : 'Carregando iniciativa...'}</p>
      <p style={{ marginTop: 0, color: '#4b5563' }}>
        Estrutura sugerida: histórico de 2024/2025 + 2026 com realizado e forecast mensal, incluindo variação de conversion rates.
      </p>

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
                    <td style={tdStyle}>{scenarioByYear[year as keyof typeof scenarioByYear]}</td>
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
        <h2 style={{ marginTop: 0 }}>2) Conversion rate mensal (varia por ano/mês)</h2>
        <label style={labelStyle}>
          Conversão
          <select value={conversionCode} onChange={(event) => setConversionCode(event.target.value as ConversionCode)}>
            <option value="">Selecione conversão...</option>
            {linkedConversions.map((code) => {
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
                    <td style={tdStyle}>{scenarioByYear[year as keyof typeof scenarioByYear]}</td>
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

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>3) Componentes fixos + fórmula aplicada</h2>
        <label style={labelStyle}>
          Componente FIXED
          <select value={componentType} onChange={(event) => setComponentType(event.target.value as ComponentTypeCode)}>
            <option value="">Selecione componente...</option>
            {linkedComponentTypes.map((type) => {
              const item = componentCatalog.find((component) => component.componentType === type)
              return <option key={type} value={type}>{item?.title ?? type}</option>
            })}
          </select>
        </label>

        {componentType ? (
          <div style={{ display: 'grid', gap: '8px' }}>
            {YEARS.map((year) => (
              <div key={year} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', alignItems: 'center' }}>
                <strong>{year}</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(60px, 1fr))', gap: '6px' }}>
                  {MONTHS.map((month) => {
                    const key = `${componentType}-${year}-${month.value}`
                    return (
                      <input
                        key={key}
                        type="number"
                        step="any"
                        style={cellInputStyle}
                        value={componentMatrix[key] ?? ''}
                        onChange={(event) => {
                          const numericValue = Number(event.target.value)
                          setComponentMatrix((current) => ({ ...current, [key]: numericValue }))
                          void saveComponentValue({ initiativeId, componentType, year, month: month.value, value: numericValue })
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div style={formulaBoxStyle}>
          <strong>Fórmula exibida para o analista</strong>
          <p style={{ margin: '4px 0 0' }}>
            Resultado mensal = Σ (KPI do mês × Conversion Rate do mês × Direção do componente) + componentes FIXED.
          </p>
          <p style={{ margin: '4px 0 0', color: '#4b5563' }}>
            Exemplo de leitura: "2024 tinha X", "2025 evoluiu para Y", "2026 está em Z e forecast W".
          </p>
        </div>
      </section>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="button" className="btn" onClick={() => onOpenComponents(initiativeId)}>
          Componentes
        </button>
        <button type="button" className="btn" onClick={() => onOpenResult(initiativeId)}>
          Resultado
        </button>
        <button type="button" className="btn" onClick={onBackToInitiatives}>
          Voltar
        </button>
      </div>
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
