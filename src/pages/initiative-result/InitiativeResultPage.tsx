import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getInitiativeById } from '../../services/initiativeService'
import type { Initiative } from '../../types/initiative'

export function InitiativeResultPage() {
  const { id } = useParams<{ id: string }>()
  const initiativeId = Number(id)
  const [initiative, setInitiative] = useState<Initiative | null>(null)

  useEffect(() => {
    if (!Number.isFinite(initiativeId)) {
      return
    }

    async function loadInitiative() {
      const data = await getInitiativeById(initiativeId)
      setInitiative(data)
    }

    void loadInitiative()
  }, [initiativeId])

  if (!Number.isFinite(initiativeId)) {
    return <p>ID de iniciativa inválido.</p>
  }

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Resultado da iniciativa #{initiativeId}</h1>
      <p>
        {initiative
          ? `Iniciativa: ${initiative.title}`
          : 'Carregando iniciativa...'}
      </p>

      <p>Esta área está preparada para exibir resultados calculados da iniciativa.</p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/initiatives/${initiativeId}/components`}>Componentes</Link>
        <Link to={`/initiatives/${initiativeId}/values`}>Valores</Link>
        <Link to="/initiatives">Voltar</Link>
      </div>
    </main>
  )
}
