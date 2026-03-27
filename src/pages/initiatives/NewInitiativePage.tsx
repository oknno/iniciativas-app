import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createInitiative } from '../../services/initiativeService'
import type { InitiativeStage, InitiativeStatus } from '../../types/initiative'

interface NewInitiativeFormState {
  title: string
  unidade: string
  responsavel: string
  stage: InitiativeStage
  status: InitiativeStatus
}

const INITIAL_STATE: NewInitiativeFormState = {
  title: '',
  unidade: '',
  responsavel: '',
  stage: 'L0',
  status: 'Ativa',
}

export function NewInitiativePage() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<NewInitiativeFormState>(INITIAL_STATE)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    try {
      await createInitiative(formState)
      navigate('/initiatives')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Nova iniciativa</h1>
        <p style={{ marginTop: '8px' }}>Cadastre os dados principais da iniciativa.</p>
      </header>

      <form onSubmit={(event) => void handleSubmit(event)} style={formStyle}>
        <label style={labelStyle}>
          Título
          <input
            value={formState.title}
            onChange={(event) =>
              setFormState((current) => ({ ...current, title: event.target.value }))
            }
            required
          />
        </label>

        <label style={labelStyle}>
          Unidade
          <input
            value={formState.unidade}
            onChange={(event) =>
              setFormState((current) => ({ ...current, unidade: event.target.value }))
            }
            required
          />
        </label>

        <label style={labelStyle}>
          Responsável
          <input
            value={formState.responsavel}
            onChange={(event) =>
              setFormState((current) => ({ ...current, responsavel: event.target.value }))
            }
            required
          />
        </label>

        <label style={labelStyle}>
          Stage
          <select
            value={formState.stage}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                stage: event.target.value as InitiativeStage,
              }))
            }
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
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                status: event.target.value as InitiativeStatus,
              }))
            }
          >
            <option value="Ativa">Ativa</option>
            <option value="Em validação">Em validação</option>
            <option value="Concluída">Concluída</option>
          </select>
        </label>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar iniciativa'}
          </button>
          <Link to="/initiatives">Cancelar</Link>
        </div>
      </form>
    </main>
  )
}

const formStyle: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
  maxWidth: '540px',
}

const labelStyle: React.CSSProperties = {
  display: 'grid',
  gap: '6px',
}
