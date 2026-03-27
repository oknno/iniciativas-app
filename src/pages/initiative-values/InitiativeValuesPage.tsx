import { useEffect, useState } from 'react'
import { getInitiativeById } from '../../services/initiativeService'
import type { Initiative } from '../../types/initiative'

interface InitiativeValuesPageProps {
  initiativeId: number
  onBackToInitiatives: () => void
  onOpenComponents: (initiativeId: number) => void
  onOpenResult: (initiativeId: number) => void
}

export function InitiativeValuesPage({
  initiativeId,
  onBackToInitiatives,
  onOpenComponents,
  onOpenResult,
}: InitiativeValuesPageProps) {
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
      <h1 style={{ marginTop: 0 }}>Valores da iniciativa #{initiativeId}</h1>
      <p>{initiative ? `Iniciativa: ${initiative.title}` : 'Carregando iniciativa...'}</p>

      <p>Esta página está preparada para concentrar inputs/edição de valores por período.</p>

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
