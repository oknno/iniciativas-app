import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Field } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { Table, type ProjectRow } from '../../components/ui/Table'
import { ToastStack, type ToastItem, type ToastTone } from '../../components/ui/Toast'
import { designTokens } from '../../designTokens'

const initialProjects: ProjectRow[] = [
  { id: 1012, title: 'Migração de ERP Financeiro', unit: 'Controladoria', status: 'Em revisão' },
  { id: 1004, title: 'Automação de Provisionamento de Acessos', unit: 'TI Corporativa', status: 'Aprovado' },
  { id: 998, title: 'Padronização de Indicadores de Operação', unit: 'Operações', status: 'Rascunho' },
  { id: 976, title: 'Consolidação de Custos de Logística Nacional', unit: 'Logística', status: 'Bloqueado' },
]

const wizardSteps = ['Preencher', 'Validar', 'Revisar', 'Confirmar']

export function CorporateManagementDemoPage() {
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(1012)
  const [statusFilter, setStatusFilter] = useState<'Todos' | ProjectRow['status']>('Todos')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBootstrapping(false), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toasts.length) return

    const timeout = window.setTimeout(() => {
      setToasts((current) => current.slice(1))
    }, 3200)

    return () => window.clearTimeout(timeout)
  }, [toasts])

  const projects = useMemo(() => {
    if (statusFilter === 'Todos') {
      return initialProjects
    }

    return initialProjects.filter((item) => item.status === statusFilter)
  }, [statusFilter])

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  )

  function pushToast(tone: ToastTone, message: string) {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), tone, message }])
  }

  function handleRefresh() {
    setIsLoading(true)
    setHasError(false)

    window.setTimeout(() => {
      setIsLoading(false)
      pushToast('info', 'Lista atualizada com sucesso.')
    }, 900)
  }

  function handleDelete() {
    setIsConfirmOpen(false)
    setSelectedId(null)
    pushToast('success', 'Projeto excluído com sucesso.')
  }

  function handleSimulateError() {
    setHasError(true)
    setIsLoading(false)
    pushToast('error', 'Erro ao carregar os projetos.')
  }

  if (isBootstrapping) {
    return (
      <div className="bootstrap-screen" aria-live="polite">
        <Card className="bootstrap-card">
          <div className="bootstrap-spinner" />
          <p className="bootstrap-eyebrow">Inicializando ambiente corporativo</p>
          <h1>Carregando workspace de gestão</h1>
          <p>Sincronizando projetos, permissões e painéis de operação.</p>
        </Card>
      </div>
    )
  }

  const canActOnSelection = Boolean(selectedProject)
  const canEdit = selectedProject?.status !== 'Aprovado'

  return (
    <div className="corp-shell">
      <header className="corp-header">
        <div>
          <h1>Gestão de Projetos Corporativos</h1>
          <p>Operação • Portfólio interno • Produtividade</p>
        </div>
      </header>

      <Card className="command-bar">
        <div className="command-actions">
          <Button onClick={handleRefresh}>Atualizar</Button>
          <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
            Novo
          </Button>
          <Button disabled={!canActOnSelection}>Visualizar</Button>
          <Button disabled={!canActOnSelection || !canEdit}>Editar</Button>
          <Button disabled={!canActOnSelection || !canEdit}>Duplicar</Button>
          <Button disabled={!canActOnSelection} onClick={() => setIsConfirmOpen(true)}>
            Excluir
          </Button>
          <Button onClick={handleSimulateError}>Simular erro</Button>
        </div>
        <div className="command-filter-wrap">
          <Button
            aria-haspopup="dialog"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((current) => !current)}
          >
            Filtro
          </Button>
          {isFilterOpen ? (
            <Card className="filter-popover" role="dialog" aria-label="Filtros de projeto">
              <h3>Filtrar projetos</h3>
              <label>
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                >
                  <option>Todos</option>
                  <option>Rascunho</option>
                  <option>Em revisão</option>
                  <option>Aprovado</option>
                  <option>Bloqueado</option>
                </select>
              </label>
              <Button
                onClick={() => {
                  setIsFilterOpen(false)
                  pushToast('info', 'Filtro aplicado.')
                }}
                variant="primary"
              >
                Aplicar
              </Button>
            </Card>
          ) : null}
        </div>
      </Card>

      <main className="corp-main-grid">
        <Card className="list-panel">
          <div className="panel-header">
            <h2>Projetos</h2>
            <Badge label={`${projects.length} itens`} tone="neutral" />
          </div>
          {isLoading ? <p aria-live="polite">Carregando…</p> : null}
          {hasError ? <p aria-live="polite">Erro ao carregar…</p> : null}
          {!isLoading && !hasError && projects.length === 0 ? <p>Nenhum item encontrado.</p> : null}
          {!isLoading && !hasError && projects.length > 0 ? (
            <Table items={projects} selectedId={selectedId} onSelect={setSelectedId} />
          ) : null}
        </Card>

        <Card className="summary-panel">
          <h2>Resumo do item</h2>
          {selectedProject ? (
            <>
              <Field label="ID">{selectedProject.id}</Field>
              <Field label="Título">{selectedProject.title}</Field>
              <Field label="Unidade">{selectedProject.unit}</Field>
              <Field label="Status">
                <Badge
                  label={selectedProject.status}
                  tone={selectedProject.status === 'Aprovado' ? 'success' : 'info'}
                />
              </Field>
            </>
          ) : (
            <p>Selecione uma linha para visualizar os detalhes.</p>
          )}

          <div className="usage-guide">
            <h3>Guia rápido de uso</h3>
            <ul>
              <li>Button: use ações primárias para fluxo principal e secundárias para apoio.</li>
              <li>Card: agrupe blocos funcionais com borda suave e respiro interno.</li>
              <li>Badge: sinalize estado de processo com leitura imediata.</li>
              <li>Field: aplique em resumos com label e valor em duas colunas.</li>
              <li>Modal: use no wizard multi-etapas com validação progressiva.</li>
              <li>Toast: feedback curto e contextual para sucesso/erro/informação.</li>
              <li>Table: priorize leitura escaneável e destaque a linha selecionada.</li>
            </ul>
          </div>

          <details className="token-details">
            <summary>Design tokens (JSON)</summary>
            <pre>{JSON.stringify(designTokens, null, 2)}</pre>
          </details>
        </Card>
      </main>

      <Modal
        open={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title="Novo projeto corporativo"
        size="wizard"
        footer={
          <>
            <Button onClick={() => setIsWizardOpen(false)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (wizardStep < wizardSteps.length - 1) {
                  setWizardStep((current) => current + 1)
                  return
                }

                setIsWizardOpen(false)
                setWizardStep(0)
                pushToast('success', 'Projeto criado e enviado para revisão.')
              }}
            >
              {wizardStep === wizardSteps.length - 1 ? 'Confirmar' : 'Próximo'}
            </Button>
          </>
        }
      >
        <div className="wizard-tabs" role="tablist" aria-label="Etapas do wizard">
          {wizardSteps.map((step, index) => {
            const stateClass =
              index === wizardStep
                ? 'is-current'
                : index < wizardStep
                  ? 'is-complete'
                  : index === wizardStep + 1
                    ? 'is-available'
                    : 'is-blocked'

            return (
              <button
                className={`wizard-tab ${stateClass}`}
                key={step}
                type="button"
                aria-current={index === wizardStep ? 'step' : undefined}
              >
                {step}
              </button>
            )
          })}
        </div>
        <div className="wizard-body">
          <label>
            Título
            <input placeholder="Digite um título objetivo" />
          </label>
          <label>
            Unidade responsável
            <select defaultValue="">
              <option value="" disabled>
                Selecione
              </option>
              <option>Controladoria</option>
              <option>TI Corporativa</option>
              <option>Operações</option>
            </select>
          </label>
          <label>
            Contexto
            <textarea rows={4} placeholder="Descreva escopo e impacto operacional." />
          </label>
        </div>
      </Modal>

      <Modal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirmar exclusão"
        size="dialog"
        footer={
          <>
            <Button onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleDelete}>
              Confirmar
            </Button>
          </>
        }
      >
        <p>Essa ação remove o projeto selecionado da operação atual. Deseja continuar?</p>
      </Modal>

      <ToastStack items={toasts} />
    </div>
  )
}
