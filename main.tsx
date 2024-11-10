import '@/index.css'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactTogether } from 'react-together'
import App from '@/App'

document.addEventListener('securitypolicyviolation', (e) => {
  console.log('🚫 CSP Violation Details from main.tsx:', {
    blockedURI: e.blockedURI,
    violatedDirective: e.violatedDirective,
    sourceFile: e.sourceFile,
    lineNumber: e.lineNumber,
    columnNumber: e.columnNumber,
  })
})

// Validate environment variables
const config = {
  appId: import.meta.env.VITE_APP_ID,
  apiKey: import.meta.env.VITE_API_KEY,
  sessionName: import.meta.env.VITE_SESSION_NAME,
  sessionPassword: import.meta.env.VITE_SESSION_PASSWORD,
}

// Debug logging
console.log('🔧 React Together Configuration:', {
  appId: config.appId,
  apiKey: config.apiKey ? '****' + config.apiKey.slice(-4) : undefined,
  sessionName: config.sessionName,
  sessionPassword: config.sessionPassword ? '****' : undefined,
})

// Wrapper component to handle connection retries
function RetryWrapper({ children }: { children: React.ReactNode }) {
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount((c) => c + 1)
        setError(null)
      }, 2000) // Retry every 2 seconds
      return () => clearTimeout(timer)
    }
  }, [error, retryCount])

  if (retryCount >= 3) {
    return <div>Failed to connect after multiple attempts. Please refresh the page.</div>
  }

  try {
    return children
  } catch (e) {
    setError(e as Error)
    return <div>Connection error, retrying... ({retryCount + 1}/3)</div>
  }
}

try {
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Root element not found')
  }

  createRoot(root).render(
    <StrictMode>
      <RetryWrapper>
        <ReactTogether
          sessionParams={{
            appId: config.appId,
            apiKey: config.apiKey,
            name: config.sessionName,
            password: config.sessionPassword,
          }}
        >
          <App />
        </ReactTogether>
      </RetryWrapper>
    </StrictMode>
  )
  console.log('🚀 App Render Initiated')
} catch (error) {
  console.error('❌ Fatal Error:', error)
}
