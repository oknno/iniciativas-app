import { useEffect, useState } from 'react'
import { getInitiativeById } from '../../services/initiativeService'
import type { Initiative } from '../../types/initiative'

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

  useEffect(() => {
    async function loadInitiative() {
      const data = await getInitiativeById(initiativeId)
      setInitiative(data)
    }

    void loadInitiative()
  }, [initiativeId])

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Resultado da iniciativa #{initiativeId}</h1>
      <p>{initiative ? `Iniciativa: ${initiative.title}` : 'Carregando iniciativa...'}</p>

      <p>Esta área está preparada para exibir resultados calculados da iniciativa.</p>

      <div style={{ display: 'flex', gap: '8px' }}>
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
