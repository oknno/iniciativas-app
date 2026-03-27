import { useState } from 'react'
import { createInitiative } from '../../services/initiativeService'
import type { InitiativeStage, InitiativeStatus } from '../../types/initiative'

interface NewInitiativeFormState {
  title: string
  unidade: string
  responsavel: string
  stage: InitiativeStage
  status: InitiativeStatus
  budget: number
  approvalYear: number
  startDate: string
  endDate: string
  businessNeed: string
  proposedSolution: string
}

interface NewInitiativePageProps {
  onCancel: () => void
  onSuccess: () => void
}

const INITIAL_STATE: NewInitiativeFormState = {
  title: '',
  unidade: '',
  responsavel: '',
  stage: 'L0',
  status: 'Ativa',
  budget: 0,
  approvalYear: new Date().getFullYear(),
  startDate: '',
  endDate: '',
  businessNeed: '',
  proposedSolution: '',
}

export function NewInitiativePage({ onCancel, onSuccess }: NewInitiativePageProps) {
  const [formState, setFormState] = useState<NewInitiativeFormState>(INITIAL_STATE)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    try {
      await createInitiative(formState)
      onSuccess()
    } finally {
      setSaving(false)
    }
  }

  return (
    <main>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Nova iniciativa</h1>
        <p style={{ marginTop: '8px' }}>
          Preencha os dados principais para abrir a jornada da iniciativa.
        </p>
      </header>

      <form onSubmit={(event) => void handleSubmit(event)} style={formStyle}>
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>1. Sobre o projeto</h2>

          <label style={labelStyle}>
            Nome do projeto
            <input
              value={formState.title}
              onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
              placeholder="Título do projeto"
              required
            />
          </label>

          <div style={twoColumnsStyle}>
            <label style={labelStyle}>
              Orçamento do projeto (R$)
              <input
                type="number"
                min={0}
                step="0.01"
                value={formState.budget}
                onChange={(event) => setFormState((current) => ({ ...current, budget: Number(event.target.value) }))}
                required
              />
            </label>

            <label style={labelStyle}>
              Ano de aprovação
              <input
                type="number"
                min={2020}
                max={2035}
                value={formState.approvalYear}
                onChange={(event) => setFormState((current) => ({ ...current, approvalYear: Number(event.target.value) }))}
                required
              />
            </label>
          </div>

          <div style={twoColumnsStyle}>
            <label style={labelStyle}>
              Data de início
              <input
                type="date"
                value={formState.startDate}
                onChange={(event) => setFormState((current) => ({ ...current, startDate: event.target.value }))}
                required
              />
            </label>

            <label style={labelStyle}>
              Data de término
              <input
                type="date"
                value={formState.endDate}
                onChange={(event) => setFormState((current) => ({ ...current, endDate: event.target.value }))}
                required
              />
            </label>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>2. Contexto e governança</h2>

          <div style={twoColumnsStyle}>
            <label style={labelStyle}>
              Unidade
              <input
                value={formState.unidade}
                onChange={(event) => setFormState((current) => ({ ...current, unidade: event.target.value }))}
                required
              />
            </label>

            <label style={labelStyle}>
              Responsável
              <input
                value={formState.responsavel}
                onChange={(event) => setFormState((current) => ({ ...current, responsavel: event.target.value }))}
                required
              />
            </label>
          </div>

          <div style={twoColumnsStyle}>
            <label style={labelStyle}>
              Stage
              <select
                value={formState.stage}
                onChange={(event) => setFormState((current) => ({ ...current, stage: event.target.value as InitiativeStage }))}
              >
                <option value="L0">L0</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="L4">L4</option>
                <option value="L5">L5</option>
              </select>
            </label>

            <label style={labelStyle}>
              Status
              <select
                value={formState.status}
                onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value as InitiativeStatus }))}
              >
                <option value="Ativa">Ativa</option>
                <option value="Em validação">Em validação</option>
                <option value="Em aprovação">Em aprovação</option>
                <option value="Concluída">Concluída</option>
              </select>
            </label>
          </div>

          <label style={labelStyle}>
            Business Need
            <textarea
              value={formState.businessNeed}
              onChange={(event) => setFormState((current) => ({ ...current, businessNeed: event.target.value }))}
              rows={3}
              required
            />
          </label>

          <label style={labelStyle}>
            Proposed Solution
            <textarea
              value={formState.proposedSolution}
              onChange={(event) => setFormState((current) => ({ ...current, proposedSolution: event.target.value }))}
              rows={3}
              required
            />
          </label>
        </section>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={saving} className="btn primary">
            {saving ? 'Salvando...' : 'Salvar iniciativa'}
          </button>
          <button type="button" onClick={onCancel} className="btn">
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}

const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: '14px',
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid #dfe3e8',
  borderRadius: '12px',
  background: '#fff',
  padding: '14px',
  display: 'grid',
  gap: '12px',
}

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '20px',
}

const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: '6px',
}

const twoColumnsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
}
