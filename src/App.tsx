import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { InitiativeComponentsPage } from './pages/initiative-components/InitiativeComponentsPage'
import { InitiativeResultPage } from './pages/initiative-result/InitiativeResultPage'
import { InitiativeValuesPage } from './pages/initiative-values/InitiativeValuesPage'
import { InitiativesPage } from './pages/initiatives/InitiativesPage'
import { NewInitiativePage } from './pages/initiatives/NewInitiativePage'

export type AppView =
  | 'initiativesList'
  | 'newInitiative'
  | 'initiativeComponents'
  | 'initiativeValues'
  | 'initiativeResult'

export default function App() {
  const [view, setView] = useState<AppView>('initiativesList')
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<number | null>(null)

  function openInitiativesList() {
    setView('initiativesList')
  }

  function openNewInitiative() {
    setView('newInitiative')
  }

  function openInitiativeComponents(initiativeId: number) {
    setSelectedInitiativeId(initiativeId)
    setView('initiativeComponents')
  }

  function openInitiativeValues(initiativeId: number) {
    setSelectedInitiativeId(initiativeId)
    setView('initiativeValues')
  }

  function openInitiativeResult(initiativeId: number) {
    setSelectedInitiativeId(initiativeId)
    setView('initiativeResult')
  }

  const currentPage = (() => {
    switch (view) {
      case 'initiativesList':
        return (
          <InitiativesPage
            onCreateNewInitiative={openNewInitiative}
            onStartFlow={openInitiativeComponents}
          />
        )
      case 'newInitiative':
        return (
          <NewInitiativePage
            onCancel={openInitiativesList}
            onSuccess={openInitiativesList}
          />
        )
      case 'initiativeComponents':
        return selectedInitiativeId === null ? (
          <p>Selecione uma iniciativa antes de iniciar o fluxo.</p>
        ) : (
          <InitiativeComponentsPage
            initiativeId={selectedInitiativeId}
            onBackToInitiatives={openInitiativesList}
            onOpenValues={openInitiativeValues}
          />
        )
      case 'initiativeValues':
        return selectedInitiativeId === null ? (
          <p>Selecione uma iniciativa antes de abrir os valores.</p>
        ) : (
          <InitiativeValuesPage
            initiativeId={selectedInitiativeId}
            onBackToInitiatives={openInitiativesList}
            onOpenComponents={openInitiativeComponents}
            onOpenResult={openInitiativeResult}
          />
        )
      case 'initiativeResult':
        return selectedInitiativeId === null ? (
          <p>Selecione uma iniciativa antes de abrir o resultado.</p>
        ) : (
          <InitiativeResultPage
            initiativeId={selectedInitiativeId}
            onBackToInitiatives={openInitiativesList}
            onOpenComponents={openInitiativeComponents}
            onOpenValues={openInitiativeValues}
          />
        )
      default:
        return null
    }
  })()

  return <AppLayout>{currentPage}</AppLayout>
}
