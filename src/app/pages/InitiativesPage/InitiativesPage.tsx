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
  const { items, selectedId, selectedStatus, selectedItemDetail, selectedItemDetailState, isWizardOpen, wizardMode, isSaving, actions } =
    useInitiativesPage()
  const [filters, setFilters] = useState<CommandBarFilters>(initialFilters)

  return (
    <div className="initiatives-app">
      <main className="initiatives-container">
        <div style={styles.pageFrame}>
            <CommandBar
              selectedId={selectedId ?? null}
              selectedStatus={selectedStatus}
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
            onView={actions.openView}
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

          <section style={styles.mainGrid}>
            <div style={styles.leftColumn}>
              <InitiativesTableSection items={items} selectedId={selectedId} onSelect={actions.select} />
            </div>

            <aside style={styles.rightColumn}>
              <div style={styles.summaryPanel}>
                <InitiativeSummarySection
                  selectedId={selectedId ?? null}
                  selectedFull={selectedItemDetail}
                  selectedFullState={selectedItemDetailState}
                />
              </div>
            </aside>
          </section>
        </div>
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
