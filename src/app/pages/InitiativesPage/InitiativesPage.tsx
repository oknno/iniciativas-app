import { useState } from 'react'
import { CommandBar, type CommandBarFilters } from './CommandBar'
import { styles } from './InitiativesPage.styles'
import { InitiativeWizardModal } from './InitiativeWizardModal'
import { InitiativesTableSection } from './components/InitiativesTableSection'
import { InitiativeSummarySection } from './components/InitiativeSummarySection'
import { useInitiativesPage } from './hooks/useInitiativesPage'

const initialFilters: CommandBarFilters = {
  searchTitle: '',
  status: '',
  unit: '',
  sortBy: 'Title',
  sortDir: 'asc',
}

export function InitiativesPage() {
  const { items, selectedId, selectedItemDetail, isWizardOpen, wizardMode, isSaving, actions } = useInitiativesPage()
  const [filters, setFilters] = useState<CommandBarFilters>(initialFilters)

  return (
    <div className="initiatives-app">
      <CommandBar
        selectedId={selectedId ?? null}
        selectedStatus={selectedItemDetail?.status ?? ''}
        totalLoaded={items.length}
        filters={filters}
        onChangeFilters={setFilters}
        onApply={() => {
          // Reserved for filter integration on table/query.
        }}
        onClear={() => {
          setFilters(initialFilters)
        }}
        onRefresh={actions.refresh}
        onNew={actions.openCreate}
        onView={() => {
          // Reserved for view action behavior.
        }}
        onEdit={actions.openEdit}
        onDuplicate={actions.duplicateSelected}
        onDelete={actions.deleteSelected}
        onSendToApproval={() => {
          // Reserved for approval flow integration.
        }}
        onBackStatus={() => {
          // Reserved for status rollback integration.
        }}
        onExport={() => {
          // Reserved for export integration.
        }}
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
