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

// Initialize React Together before rendering
console.log('Initializing React Together with config:', {
  appId: config.appId,
  apiKey: '****' + config.apiKey.slice(-4),
  sessionName: config.sessionName,
})

// Wait for everything to be ready
window.addEventListener('load', () => {
  const root = document.getElementById('root')
  if (!root) {
    console.error('Root element not found')
    return
  }

  createRoot(root).render(
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
})
