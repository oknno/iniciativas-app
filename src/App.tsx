import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { InitiativeComponentsPage } from './pages/initiative-components/InitiativeComponentsPage'
import { InitiativeResultPage } from './pages/initiative-result/InitiativeResultPage'
import { InitiativeValuesPage } from './pages/initiative-values/InitiativeValuesPage'
import { InitiativesPage } from './pages/initiatives/InitiativesPage'
import { NewInitiativePage } from './pages/initiatives/NewInitiativePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/initiatives" replace />} />
        <Route path="/initiatives" element={<InitiativesPage />} />
        <Route path="/initiatives/new" element={<NewInitiativePage />} />
        <Route
          path="/initiatives/:id/components"
          element={<InitiativeComponentsPage />}
        />
        <Route path="/initiatives/:id/values" element={<InitiativeValuesPage />} />
        <Route path="/initiatives/:id/result" element={<InitiativeResultPage />} />
      </Route>
    </Routes>
  )
}
