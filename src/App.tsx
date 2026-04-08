import { ToastProvider } from './app/components/notifications/ToastProvider'
import { BootstrapLoader } from './app/components/feedback/BootstrapLoader'
import { StateMessage } from './app/components/ui/StateMessage'
import { AccessProvider, useAccess } from './app/access/AccessContext'
import { OwnerInitiativesPage } from './app/pages/InitiativesPage/OwnerInitiativesPage'
import { LocalControllerPage } from './app/pages/InitiativesPage/LocalControllerPage'
import { StrategicControllerPage } from './app/pages/InitiativesPage/StrategicControllerPage'
import { InitiativesPage } from './app/pages/InitiativesPage/InitiativesPage'

function App() {
  return (
    <ToastProvider>
      <AccessProvider>
        <AppShell />
      </AccessProvider>
    </ToastProvider>
  )
}

function AppShell() {
  const { isLoading, errorMessage, isConfigured, context } = useAccess()

  if (isLoading) {
    return <BootstrapLoader title="Initiatives Core System" message="Carregando perfil de acesso..." />
  }

  if (errorMessage) {
    return (
      <BootstrapLoader
        title="Initiatives Core System"
        message="Não foi possível resolver permissões de acesso. Verifique a configuração do SharePoint."
      />
    )
  }

  if (!isConfigured) {
    return (
      <div style={{ maxWidth: 760, margin: '32px auto' }}>
        <StateMessage
          title="Acesso não configurado"
          description={`O usuário ${context?.currentUserLogin ?? 'atual'} não está cadastrado na lista User_Access. Ações foram bloqueadas.`}
        />
      </div>
    )
  }

  if (context?.role === 'OWNER') {
    return <OwnerInitiativesPage />
  }

  if (context?.role === 'CTRL_LOCAL') {
    return <LocalControllerPage />
  }

  if (context?.role === 'CTRL_ESTRATEGICA') {
    return <StrategicControllerPage />
  }

  return <InitiativesPage />
}

export default App
