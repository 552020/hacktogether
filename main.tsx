import '@/index.css'
import { StrictMode } from 'react'
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

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
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
    </StrictMode>
  )
  console.log('🚀 App Render Initiated')
} catch (error) {
  console.error('❌ Fatal Error:', error)
}
