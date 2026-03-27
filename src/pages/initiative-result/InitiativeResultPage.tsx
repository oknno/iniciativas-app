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

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Resultado da iniciativa #{initiativeId}</h1>
      <p>{initiative ? `Iniciativa: ${initiative.title}` : 'Carregando iniciativa...'}</p>

      {error ? <p style={{ color: '#b00020' }}>{error}</p> : null}

      {results.length === 0 && !error ? (
        <p>Nenhum resultado calculado. Verifique se há componentes e valores cadastrados.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr>
                <th style={thStyle}>Período</th>
                <th style={thStyle}>Ganho mensal</th>
                <th style={thStyle}>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={`${result.year}-${result.month}`}>
                  <td style={tdStyle}>{result.year}/{String(result.month).padStart(2, '0')}</td>
                  <td style={tdStyle}>{result.gainValue.toFixed(2)}</td>
                  <td style={tdStyle}>
                    {result.components
                      .map((component) => `${component.componentType}: ${component.signedValue.toFixed(2)}`)
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
        </>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button type="button" onClick={() => onOpenComponents(initiativeId)}>
          Componentes
        </button>
        <button type="button" onClick={() => onOpenValues(initiativeId)}>
          Valores
        </button>
        <button type="button" onClick={onBackToInitiatives}>
          Voltar
        </button>
      </div>
    </main>
  )
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
