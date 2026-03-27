import { useCallback, useEffect, useState } from 'react'
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
  saveKpiValue,
} from '../../services/valueService'
import type { ComponentMaster } from '../../types/component'
import type { ConversionMaster } from '../../types/conversion'
import type { InitiativeComponent } from '../../types/initiativeComponent'
import type { Initiative } from '../../types/initiative'
import type { KpiMaster } from '../../types/kpi'
import type { ComponentTypeCode } from '../../types/component'
import type { KPICode } from '../../types/kpi'

interface InitiativeValuesPageProps {
  initiativeId: number
  onBackToInitiatives: () => void
  onOpenComponents: (initiativeId: number) => void
  onOpenResult: (initiativeId: number) => void
}

const INITIAL_PERIOD = { year: 2026, month: 1, value: 0 }

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
  const [kpiValues, setKpiValues] = useState<string[]>([])
  const [componentValues, setComponentValues] = useState<string[]>([])
  const [conversionValues, setConversionValues] = useState<string[]>([])

  const [kpiForm, setKpiForm] = useState({ kpiCode: '', ...INITIAL_PERIOD })
  const [componentForm, setComponentForm] = useState({ componentType: '', ...INITIAL_PERIOD })

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
    }

    void loadData()
  }, [initiativeId])

  const refreshValues = useCallback(async () => {
    const [kpi, component, conversion] = await Promise.all([
      listKpiValues(initiativeId),
      listComponentValues(initiativeId),
      listConversionValues(),
    ])

    setKpiValues(kpi.map((item) => `${item.year}/${item.month} - ${item.kpiCode}: ${item.value}`))
    setComponentValues(component.map((item) => `${item.year}/${item.month} - ${item.componentType}: ${item.value}`))
    setConversionValues(conversion.map((item) => `${item.year}/${item.month} - ${item.conversionCode}: ${item.value}`))
  }, [initiativeId])

  useEffect(() => {
    void refreshValues()
  }, [refreshValues])

  const kpiOptions = components.filter((component) => component.kpiCode).map((component) => component.kpiCode)
  const fixedComponentOptions = components
    .filter((component) => {
      const master = componentCatalog.find((item) => item.componentType === component.componentType)
      return master?.calculationType === 'FIXED'
    })
    .map((component) => component.componentType)

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Valores da iniciativa #{initiativeId}</h1>
      <p>{initiative ? `Iniciativa: ${initiative.title}` : 'Carregando iniciativa...'}</p>

      <p>Entrada de dados manual da PoC (sem SharePoint por enquanto). Conversões ficam globais e visíveis abaixo.</p>

      <section style={sectionStyle}>
        <h2>KPI_Values</h2>
        <form
          style={formStyle}
          onSubmit={(event) => {
            event.preventDefault()
            if (!kpiForm.kpiCode) return
            void saveKpiValue({ initiativeId, ...kpiForm, kpiCode: kpiForm.kpiCode as KPICode }).then(refreshValues)
          }}
        >
          <select value={kpiForm.kpiCode} onChange={(event) => setKpiForm((c) => ({ ...c, kpiCode: event.target.value }))}>
            <option value="">Selecione KPI...</option>
            {kpiOptions.map((kpiCode) => {
              const item = kpiCatalog.find((kpi) => kpi.code === kpiCode)
              return <option key={kpiCode} value={kpiCode}>{item?.title ?? kpiCode}</option>
            })}
          </select>
          <input type="number" value={kpiForm.year} onChange={(event) => setKpiForm((c) => ({ ...c, year: Number(event.target.value) }))} />
          <input type="number" min={1} max={12} value={kpiForm.month} onChange={(event) => setKpiForm((c) => ({ ...c, month: Number(event.target.value) }))} />
          <input type="number" step="any" value={kpiForm.value} onChange={(event) => setKpiForm((c) => ({ ...c, value: Number(event.target.value) }))} />
          <button type="submit">Salvar KPI</button>
        </form>
        <ul>{kpiValues.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section style={sectionStyle}>
        <h2>Component_Values (FIXED)</h2>
        <form
          style={formStyle}
          onSubmit={(event) => {
            event.preventDefault()
            if (!componentForm.componentType) return
            void saveComponentValue({ initiativeId, ...componentForm, componentType: componentForm.componentType as ComponentTypeCode }).then(refreshValues)
          }}
        >
          <select value={componentForm.componentType} onChange={(event) => setComponentForm((c) => ({ ...c, componentType: event.target.value }))}>
            <option value="">Selecione Componente...</option>
            {fixedComponentOptions.map((componentType) => {
              const item = componentCatalog.find((component) => component.componentType === componentType)
              return <option key={componentType} value={componentType}>{item?.title ?? componentType}</option>
            })}
          </select>
          <input type="number" value={componentForm.year} onChange={(event) => setComponentForm((c) => ({ ...c, year: Number(event.target.value) }))} />
          <input type="number" min={1} max={12} value={componentForm.month} onChange={(event) => setComponentForm((c) => ({ ...c, month: Number(event.target.value) }))} />
          <input type="number" step="any" value={componentForm.value} onChange={(event) => setComponentForm((c) => ({ ...c, value: Number(event.target.value) }))} />
          <button type="submit">Salvar componente</button>
        </form>
        <ul>{componentValues.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section style={sectionStyle}>
        <h2>Conversion_Values (global)</h2>
        <p>Valores globais simulados para PoC:</p>
        <ul>{conversionValues.map((item) => <li key={item}>{item}</li>)}</ul>
        <small>Catálogo de conversões: {conversionCatalog.map((item) => item.code).join(', ')}</small>
      </section>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="button" onClick={() => onOpenComponents(initiativeId)}>
          Componentes
        </button>
        <button type="button" onClick={() => onOpenResult(initiativeId)}>
          Resultado
        </button>
        <button type="button" onClick={onBackToInitiatives}>
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
}

const formStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
  gap: '8px',
}
