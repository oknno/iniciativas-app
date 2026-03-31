import { CommandBar } from './CommandBar'
import { styles } from './InitiativesPage.styles'
import { InitiativeWizardModal } from './InitiativeWizardModal'
import { InitiativesTableSection } from './components/InitiativesTableSection'
import { InitiativeSummarySection } from './components/InitiativeSummarySection'
import { useInitiativesPage } from './hooks/useInitiativesPage'

export function InitiativesPage() {
  const { items, selectedId, selectedItemDetail, isWizardOpen, wizardMode, isLoading, isSaving, commandState, actions } =
    useInitiativesPage()

  return (
    <div className="initiatives-app">
      <CommandBar
        totalItems={items.length}
        isLoading={isLoading}
        canEdit={commandState.canEdit}
        canDuplicate={commandState.canDuplicate}
        canDelete={commandState.canDelete}
        onRefresh={actions.refresh}
        onNew={actions.openCreate}
        onEdit={actions.openEdit}
        onDuplicate={actions.duplicateSelected}
        onDelete={actions.deleteSelected}
      />
      <main className="initiatives-container">
        <section style={styles.mainGrid}>
          <InitiativesTableSection items={items} selectedId={selectedId} onSelect={actions.select} />
          <InitiativeSummarySection item={selectedItemDetail} />
        </section>
      </main>
      <InitiativeWizardModal
        isOpen={isWizardOpen}
        mode={wizardMode}
        isSaving={isSaving}
        selectedInitiative={selectedItemDetail}
        onClose={actions.closeWizard}
        onSave={actions.saveFromWizard}
      />
    </div>
  )
}
