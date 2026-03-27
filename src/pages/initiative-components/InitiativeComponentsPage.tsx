import { useEffect, useMemo, useState } from 'react'
import { getComponentMasterCatalog } from '../../services/componentMasterService'
import { getConversionMasterCatalog } from '../../services/conversionMasterService'
import { getFormulaMasterCatalog } from '../../services/formulaMasterService'
import {
  getAvailableFormulas,
  INITIAL_COMPONENT_FORM_STATE,
  normalizeComponentFormState,
  validateComponentForm,
  type InitiativeComponentFormState,
} from '../../services/initiativeComponentFormService'
import {
  createInitiativeComponent,
  listInitiativeComponents,
  removeInitiativeComponent,
  updateInitiativeComponent,
} from '../../services/initiativeComponentService'
import { getKpiMasterCatalog } from '../../services/kpiMasterService'
import type { ComponentMaster } from '../../types/component'
import type { ConversionMaster } from '../../types/conversion'
import type { FormulaMaster } from '../../types/formula'
import type { InitiativeComponent } from '../../types/initiativeComponent'
import type { KpiMaster } from '../../types/kpi'
import type { ConversionCode } from '../../types/conversion'
import type { FormulaCode } from '../../types/formula'
import type { KPICode } from '../../types/kpi'

interface InitiativeComponentsPageProps {
  initiativeId: number
  onBackToInitiatives: () => void
  onOpenValues: (initiativeId: number) => void
}

export function InitiativeComponentsPage({
  initiativeId,
  onBackToInitiatives,
  onOpenValues,
}: InitiativeComponentsPageProps) {
  const [components, setComponents] = useState<InitiativeComponent[]>([])
  const [componentCatalog, setComponentCatalog] = useState<ComponentMaster[]>([])
  const [kpiCatalog, setKpiCatalog] = useState<KpiMaster[]>([])
  const [conversionCatalog, setConversionCatalog] = useState<ConversionMaster[]>([])
  const [formulaCatalog, setFormulaCatalog] = useState<FormulaMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [formState, setFormState] = useState<InitiativeComponentFormState>(
    INITIAL_COMPONENT_FORM_STATE,
  )
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      try {
        const [items, component, kpi, conversion, formula] = await Promise.all([
          listInitiativeComponents(initiativeId),
          getComponentMasterCatalog(),
          getKpiMasterCatalog(),
          getConversionMasterCatalog(),
          getFormulaMasterCatalog(),
        ])

        setComponents(items)
        setComponentCatalog(component)
        setKpiCatalog(kpi)
        setConversionCatalog(conversion)
        setFormulaCatalog(formula)
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [initiativeId])

  const gainComponentCatalog = useMemo(
    () => componentCatalog.filter((item) => item.direction > 0),
    [componentCatalog],
  )

  useEffect(() => {
    setFormState((current) => normalizeComponentFormState(current, gainComponentCatalog))
  }, [formState.componentType, gainComponentCatalog])

  const selectedMasterComponent = useMemo(
    () => gainComponentCatalog.find((item) => item.componentType === formState.componentType),
    [gainComponentCatalog, formState.componentType],
  )

  function resetForm() {
    setFormState(INITIAL_COMPONENT_FORM_STATE)
    setEditingIndex(null)
    setValidationError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const error = validateComponentForm(formState, gainComponentCatalog)
    if (error) {
      setValidationError(error)
      return
    }

    const payload = {
      componentType: formState.componentType,
      kpiCode: (formState.kpiCode || undefined) as KPICode | undefined,
      conversionCode: (formState.conversionCode || undefined) as ConversionCode | undefined,
      formulaCode: formState.formulaCode as FormulaCode,
    }

    if (editingIndex === null) {
      await createInitiativeComponent(initiativeId, payload)
    } else {
      await updateInitiativeComponent(initiativeId, editingIndex, payload)
    }

    const updatedItems = await listInitiativeComponents(initiativeId)
    setComponents(updatedItems)
    resetForm()
  }

  function handleEdit(index: number) {
    const item = components[index]

    setFormState({
      componentType: item.componentType,
      kpiCode: item.kpiCode ?? '',
      conversionCode: item.conversionCode ?? '',
      formulaCode: item.formulaCode,
    })
    setEditingIndex(index)
    setValidationError(null)
  }

  async function handleDelete(index: number) {
    await removeInitiativeComponent(initiativeId, index)
    const updatedItems = await listInitiativeComponents(initiativeId)
    setComponents(updatedItems)

    if (editingIndex === index) {
      resetForm()
    }
  }

  const availableFormulas = useMemo(
    () => getAvailableFormulas(formState, formulaCatalog, gainComponentCatalog),
    [formState, formulaCatalog, gainComponentCatalog],
  )

  const visibleGainComponents = useMemo(
    () => components.filter((component) => {
      const master = componentCatalog.find((item) => item.componentType === component.componentType)
      return (master?.direction ?? 0) > 0
    }),
    [componentCatalog, components],
  )
  const hiddenNonGainCount = components.length - visibleGainComponents.length
  const isFixedComponent = selectedMasterComponent?.calculationType === 'FIXED'

  return (
    <main>
      <header className="capex-topbar">
        <div>
          <h1 style={{ margin: 0 }}>Etapa 1 de 4 · KPI e ganho da iniciativa #{initiativeId}</h1>
          <p style={{ marginTop: '6px', marginBottom: 0 }}>Cadastre somente o KPI de ganho nesta etapa. Custos/compensações ficam separados na próxima etapa.</p>
        </div>

        <div className="capex-topbar-actions">
          <button type="button" className="btn" onClick={onBackToInitiatives}>
            Voltar para iniciativas
          </button>
          <button type="button" className="btn primary" onClick={() => onOpenValues(initiativeId)}>
            Continuar para etapa 2 (Compensação/Custo)
          </button>
        </div>
      </header>

      <section className="flow-stepper">
        <div className="flow-step active"><strong>1. KPI/Ganho</strong>Cadastrar componentes de ganho.</div>
        <div className="flow-step"><strong>2. Compensação/Custo</strong>Separar custos de viabilização.</div>
        <div className="flow-step"><strong>3. Valores mensais</strong>Preencher série mensal.</div>
        <div className="flow-step"><strong>4. Resultado</strong>Visualizar líquido final.</div>
      </section>

      <section className="flow-guidance">
        <strong>Você está preenchendo ganho.</strong> Não misture custos (ex.: compra de software) com ganho nesta etapa.
      </section>

      {loading ? (
        <p>Carregando componentes...</p>
      ) : (
        <>
          {hiddenNonGainCount > 0 ? (
            <section className="flow-guidance" style={{ marginBottom: '12px' }}>
              <strong>{hiddenNonGainCount} item(ns) de custo foram ocultados nesta etapa.</strong> Custos/compensações devem ser preenchidos somente na etapa 2.
            </section>
          ) : null}
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ marginTop: 0 }}>KPIs/componentes de ganho</h2>
            <div style={listPanelStyle}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Componente</th>
                    <th style={thStyle}>Tipo cálculo</th>
                    <th style={thStyle}>KPI</th>
                    <th style={thStyle}>Conversão</th>
                    <th style={thStyle}>Fórmula</th>
                    <th style={thStyle}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleGainComponents.length === 0 ? (
                    <tr>
                      <td style={tdStyle} colSpan={7}>
                        Nenhum componente cadastrado.
                      </td>
                    </tr>
                  ) : (
                    visibleGainComponents.map((component, index) => {
                      const master = componentCatalog.find((item) => item.componentType === component.componentType)
                      const originalIndex = components.findIndex((current) => current === component)
                      return (
                        <tr key={`${component.initiativeId}-${index}`}>
                          <td style={tdStyle}>{index + 1}</td>
                          <td style={tdStyle}>{component.componentType}</td>
                          <td style={tdStyle}>{master?.calculationType ?? '-'}</td>
                          <td style={tdStyle}>{component.kpiCode ?? '-'}</td>
                          <td style={tdStyle}>{component.conversionCode ?? '-'}</td>
                          <td style={tdStyle}>{component.formulaCode}</td>
                          <td style={tdStyle}>
                            <button type="button" className="btn" onClick={() => handleEdit(originalIndex)}>
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn"
                              onClick={() => void handleDelete(originalIndex)}
                              style={{ marginLeft: '8px' }}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section style={formPanelStyle}>
            <h2 style={{ marginTop: 0 }}>{editingIndex === null ? 'Novo KPI de ganho' : `Editando KPI de ganho #${editingIndex + 1}`}</h2>
            <form onSubmit={(event) => void handleSubmit(event)} style={formStyle}>
              <label style={labelStyle}>
                Componente
                <select
                  value={formState.componentType}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      componentType: event.target.value as InitiativeComponent['componentType'],
                    }))
                  }
                >
                  {gainComponentCatalog.map((component) => (
                    <option key={component.componentType} value={component.componentType}>
                      {component.title} ({component.componentType})
                    </option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                KPI de ganho
                <select
                  value={formState.kpiCode}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, kpiCode: event.target.value }))
                  }
                  disabled={isFixedComponent}
                >
                  <option value="">Selecione...</option>
                  {kpiCatalog.map((kpi) => (
                    <option key={kpi.code} value={kpi.code}>
                      {kpi.title}
                    </option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                Conversão
                <select
                  value={formState.conversionCode}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      conversionCode: event.target.value,
                    }))
                  }
                  disabled={isFixedComponent}
                >
                  <option value="">Selecione...</option>
                  {conversionCatalog.map((conversion) => (
                    <option key={conversion.code} value={conversion.code}>
                      {conversion.title}
                    </option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                Fórmula
                <select
                  value={formState.formulaCode}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, formulaCode: event.target.value }))
                  }
                >
                  {availableFormulas.map((formula) => (
                    <option key={formula.code} value={formula.code}>
                      {formula.title}
                    </option>
                  ))}
                </select>
              </label>

              {validationError ? (
                <p style={{ margin: 0, color: '#b00020' }}>{validationError}</p>
              ) : null}

              <div>
                <button type="submit" className="btn primary">
                  {editingIndex === null ? 'Adicionar componente' : 'Salvar edição'}
                </button>
                {editingIndex !== null ? (
                  <button
                    type="button"
                    className="btn"
                    style={{ marginLeft: '8px' }}
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        </>
      )}
    </main>
  )
}

const listPanelStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden',
  background: '#fff',
}

const formPanelStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  background: '#fff',
  padding: '14px',
}

const formStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '12px',
  alignItems: 'end',
}

const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: '6px',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f8fafc',
}

const tdStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #f1f5f9',
}
