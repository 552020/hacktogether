import '@/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactTogether } from 'react-together'
import App from '@/App'

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
  apiKey: config.apiKey ? '****' + config.apiKey.slice(-4) : undefined, // Show only last 4 chars of API key
  sessionName: config.sessionName,
  sessionPassword: config.sessionPassword ? '****' : undefined,
})

// Validate required fields
const missingFields = Object.entries(config)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingFields.length > 0) {
  console.error('❌ Missing required environment variables:', missingFields)
  throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`)
}

// Additional validation for appId format
if (!config.appId.startsWith('dev.reacttogether.')) {
  console.warn('⚠️ APP_ID should start with "dev.reacttogether."')
}

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
        onError={(error) => {
          console.error('❌ React Together Error:', error)
        }}
        onConnect={() => {
          console.log('✅ React Together Connected Successfully')
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
