import { useEffect, useState } from 'react'
import { ToastProvider } from './app/components/notifications/ToastProvider'
import { BootstrapLoader } from './app/components/feedback/BootstrapLoader'
import { InitiativesPage } from './app/pages/InitiativesPage/InitiativesPage'

const BOOTSTRAP_DELAY_MS = 900

function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsBootstrapping(false)
    }, BOOTSTRAP_DELAY_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <ToastProvider>
      {isBootstrapping ? (
        <BootstrapLoader title="Initiatives Core System" message="Preparing workspace..." />
      ) : (
        <InitiativesPage />
      )}
    </ToastProvider>
  )
}

export default App
