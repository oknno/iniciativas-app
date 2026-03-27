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
  onOpenResult: (initiativeId: number) => void
}

export function InitiativeComponentsPage({
  initiativeId,
  onBackToInitiatives,
  onOpenValues,
  onOpenResult,
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

  useEffect(() => {
    setFormState((current) => normalizeComponentFormState(current, componentCatalog))
  }, [formState.componentType, componentCatalog])

  const selectedMasterComponent = useMemo(
    () => componentCatalog.find((item) => item.componentType === formState.componentType),
    [componentCatalog, formState.componentType],
  )

  function resetForm() {
    setFormState(INITIAL_COMPONENT_FORM_STATE)
    setEditingIndex(null)
    setValidationError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const error = validateComponentForm(formState, componentCatalog)
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
    () => getAvailableFormulas(formState, formulaCatalog, componentCatalog),
    [formState, formulaCatalog, componentCatalog],
  )

  const isFixedComponent = selectedMasterComponent?.calculationType === 'FIXED'

  return (
    <main>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Componentes da iniciativa #{initiativeId}</h1>
        <p style={{ marginTop: '8px' }}>Configure os componentes positivos/negativos que formam o ganho.</p>
      </header>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button type="button" onClick={onBackToInitiatives}>
          Voltar para iniciativas
        </button>
        <button type="button" onClick={() => onOpenValues(initiativeId)}>
          Valores
        </button>
        <button type="button" onClick={() => onOpenResult(initiativeId)}>
          Resultado
        </button>
      </div>

      {loading ? (
        <p>Carregando componentes...</p>
      ) : (
        <>
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ marginTop: 0 }}>Lista de componentes</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
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
                {components.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan={7}>
                      Nenhum componente cadastrado.
                    </td>
                  </tr>
                ) : (
                  components.map((component, index) => {
                    const master = componentCatalog.find((item) => item.componentType === component.componentType)
                    return (
                      <tr key={`${component.initiativeId}-${index}`}>
                        <td style={tdStyle}>{index + 1}</td>
                        <td style={tdStyle}>{component.componentType}</td>
                        <td style={tdStyle}>{master?.calculationType ?? '-'}</td>
                        <td style={tdStyle}>{component.kpiCode ?? '-'}</td>
                        <td style={tdStyle}>{component.conversionCode ?? '-'}</td>
                        <td style={tdStyle}>{component.formulaCode}</td>
                        <td style={tdStyle}>
                          <button type="button" onClick={() => handleEdit(index)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(index)}
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
          </section>

          <section>
            <h2 style={{ marginTop: 0 }}>{editingIndex === null ? 'Novo componente' : `Editando componente #${editingIndex + 1}`}</h2>
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
                  {componentCatalog.map((component) => (
                    <option key={component.componentType} value={component.componentType}>
                      {component.title} ({component.componentType})
                    </option>
                  ))}
                </select>
              </label>

              <label style={labelStyle}>
                KPI
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
                <button type="submit">
                  {editingIndex === null ? 'Adicionar componente' : 'Salvar edição'}
                </button>
                {editingIndex !== null ? (
                  <button
                    type="button"
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

const formStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
  alignItems: 'end',
}

const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: '6px',
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
