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

// Hardcoded configuration
const config = {
  appId: 'dev.reacttogether.hacktogether',
  apiKey: '2m8V3gb2hYZ54JrEfXnFDhyJsJtTIOEyxkN3x2mPBx',
  sessionName: 'My Session',
  sessionPassword: '123456',
}

// Make sure the DOM is fully loaded
const mountApp = () => {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    console.error('Root element not found, retrying in 100ms...')
    setTimeout(mountApp, 100)
    return
  }

  try {
    const root = createRoot(rootElement)
    root.render(
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
    console.log('🚀 App mounted successfully')
  } catch (error) {
    console.error('❌ Error mounting app:', error)
  }
}

// Start mounting process
mountApp()
