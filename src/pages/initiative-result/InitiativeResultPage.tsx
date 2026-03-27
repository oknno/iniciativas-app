import { useEffect, useMemo, useState } from 'react'
import { getComponentMasterCatalog } from '../../services/componentMasterService'
import { listInitiativeComponents } from '../../services/initiativeComponentService'
import { getInitiativeById } from '../../services/initiativeService'
import { listComponentValues, listConversionValues, listKpiValues } from '../../services/valueService'
import type { MonthlyGainResult } from '../../types/calculation'
import type { Initiative } from '../../types/initiative'
import { calculateMonthlyGain } from '../../utils/calculationEngine'

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

interface InitiativeResultPageProps {
  initiativeId: number
  onBackToInitiatives: () => void
  onOpenComponents: (initiativeId: number) => void
  onOpenValues: (initiativeId: number) => void
}

export function InitiativeResultPage({
  initiativeId,
  onBackToInitiatives,
  onOpenComponents,
  onOpenValues,
}: InitiativeResultPageProps) {
  const [initiative, setInitiative] = useState<Initiative | null>(null)
  const [results, setResults] = useState<MonthlyGainResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAndCalculate() {
      const [initiativeData, components, componentMasterCatalog, kpiValues, componentValues, conversionValues] = await Promise.all([
        getInitiativeById(initiativeId),
        listInitiativeComponents(initiativeId),
        getComponentMasterCatalog(),
        listKpiValues(initiativeId),
        listComponentValues(initiativeId),
        listConversionValues(),
      ])

      setInitiative(initiativeData)

      try {
        const calculated = calculateMonthlyGain({
          initiativeId,
          initiativeComponents: components,
          componentMasterCatalog,
          kpiValues,
          componentValues,
          conversionValues,
        })
        setResults(calculated)
        setError(null)
      } catch (calculationError) {
        setError(calculationError instanceof Error ? calculationError.message : 'Erro desconhecido')
        setResults([])
      }
    }

    void loadAndCalculate()
  }, [initiativeId])

  const total = useMemo(
    () => results.reduce((sum, item) => sum + item.gainValue, 0),
    [results],
  )

  const resultMatrix = useMemo(() => {
    const matrix: Record<string, number> = {}
    for (const item of results) {
      matrix[`${item.year}-${item.month}`] = item.gainValue
    }
    return matrix
  }, [results])

  return (
    <main>
      <header className="capex-topbar">
        <div>
          <h1>Etapa 4 de 4 · Resultado consolidado</h1>
          <p>{initiative ? `Iniciativa #${initiativeId}: ${initiative.title}` : 'Carregando iniciativa...'}</p>
        </div>
        <div className="capex-topbar-actions">
          <button type="button" onClick={() => onOpenComponents(initiativeId)} className="btn">
            Etapa 1 (KPI/Ganho)
          </button>
          <button type="button" onClick={() => onOpenValues(initiativeId)} className="btn">
            Etapas 2-3 (Custos/Valores)
          </button>
          <button type="button" onClick={onBackToInitiatives} className="btn">
            Voltar
          </button>
        </div>
      </header>

      {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}

      <section className="flow-stepper">
        <div className="flow-step"><strong>1. KPI/Ganho</strong>Definição do ganho.</div>
        <div className="flow-step"><strong>2. Compensação/Custo</strong>Custos separados.</div>
        <div className="flow-step"><strong>3. Valores mensais</strong>Série por mês.</div>
        <div className="flow-step active"><strong>4. Resultado</strong>Consolidação final.</div>
      </section>

      {results.length === 0 && !error ? (
        <p>Nenhum resultado calculado. Verifique se há componentes e valores cadastrados.</p>
      ) : (
        <>
          <div style={tableWrapperStyle}>
            <table style={matrixTableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Ano</th>
                  {MONTHS.map((month) => <th key={month.value} style={thStyle}>{month.label}</th>)}
                  <th style={thStyle}>Total anual</th>
                </tr>
              </thead>
              <tbody>
                {YEARS.map((year) => (
                  <tr key={year}>
                    <td style={tdStyle}>{year}</td>
                    {MONTHS.map((month) => (
                      <td key={`${year}-${month.value}`} style={tdStyle}>
                        {(resultMatrix[`${year}-${month.value}`] ?? 0).toFixed(2)}
                      </td>
                    ))}
                    <td style={tdStyle}>
                      {MONTHS
                        .reduce((sum, month) => sum + (resultMatrix[`${year}-${month.value}`] ?? 0), 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={thStyle}>Total</td>
                  <td style={thStyle} colSpan={12}>Soma dos meses</td>
                  <td style={thStyle}>{total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <section style={formulaStyle}>
            <strong>Fórmula usada no resultado</strong>
            <p style={{ margin: '4px 0 0' }}>
              Para componentes KPI_BASED: <em>KPI mensal × conversion rate mensal × direção</em>. Para componentes FIXED: <em>valor fixo mensal × direção</em>.
            </p>
          </section>
        </>
      )}
    </main>
  )
}

const tableWrapperStyle: React.CSSProperties = {
  overflowX: 'auto',
}

const matrixTableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #ddd',
  background: '#fff',
}

const formulaStyle: React.CSSProperties = {
  marginTop: '12px',
  border: '1px dashed #94a3b8',
  borderRadius: '8px',
  background: '#f8fafc',
  padding: '10px',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f5f5f5',
}

const tdStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #eee',
}
