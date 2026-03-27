import { useEffect, useMemo, useState } from 'react'
import { getComponentMasterCatalog } from '../../services/componentMasterService'
import { listInitiativeComponents } from '../../services/initiativeComponentService'
import { getInitiativeById } from '../../services/initiativeService'
import { listComponentValues, listConversionValues, listKpiValues } from '../../services/valueService'
import type { MonthlyGainResult } from '../../types/calculation'
import type { Initiative } from '../../types/initiative'
import { calculateMonthlyGain } from '../../utils/calculationEngine'

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

  const yearlySummary = useMemo(() => {
    return [2024, 2025, 2026].map((year) => {
      const annualResults = results.filter((result) => result.year === year)
      return {
        year,
        total: annualResults.reduce((sum, month) => sum + month.gainValue, 0),
      }
    })
  }, [results])

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Resultado da iniciativa #{initiativeId}</h1>
      <p>{initiative ? `Iniciativa: ${initiative.title}` : 'Carregando iniciativa...'}</p>

      {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}

      {results.length === 0 && !error ? (
        <p>Nenhum resultado calculado. Verifique se há componentes e valores cadastrados.</p>
      ) : (
        <>
          <section style={boxStyle}>
            <h2 style={{ marginTop: 0 }}>Comparativo 2024 x 2025 x 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {yearlySummary.map((item) => (
                <article key={item.year} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px' }}>
                  <strong>{item.year}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '20px' }}>{item.total.toFixed(2)}</p>
                </article>
              ))}
            </div>
          </section>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>Período</th>
                <th style={thStyle}>Ganho mensal</th>
                <th style={thStyle}>Detalhe do cálculo</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={`${result.year}-${result.month}`}>
                  <td style={tdStyle}>{result.year}/{String(result.month).padStart(2, '0')}</td>
                  <td style={tdStyle}>{result.gainValue.toFixed(2)}</td>
                  <td style={tdStyle}>
                    {result.components
                      .map((component) => `${component.componentType}: valor=${component.componentValue.toFixed(2)} × direção => ${component.signedValue.toFixed(2)}`)
                      .join(' | ')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={thStyle}>Total</td>
                <td style={thStyle}>{total.toFixed(2)}</td>
                <td style={thStyle}>Soma dos meses</td>
              </tr>
            </tfoot>
          </table>

          <section style={formulaStyle}>
            <strong>Fórmula usada no resultado</strong>
            <p style={{ margin: '4px 0 0' }}>
              Para componentes KPI_BASED: <em>KPI mensal × conversion rate mensal × direção</em>. Para componentes FIXED: <em>valor fixo mensal × direção</em>.
            </p>
          </section>
        </>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button type="button" onClick={() => onOpenComponents(initiativeId)} className="btn">
          Componentes
        </button>
        <button type="button" onClick={() => onOpenValues(initiativeId)} className="btn">
          Valores
        </button>
        <button type="button" onClick={onBackToInitiatives} className="btn">
          Voltar
        </button>
      </div>
    </main>
  )
}

const boxStyle: React.CSSProperties = {
  marginBottom: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  padding: '12px',
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
