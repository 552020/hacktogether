import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [ViteYaml(), react(), tsconfigPaths()],
  server: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self' https://*.sldunit.xyz/ https://*.vercel.app/; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live/ https://*.sldunit.xyz/ https://*.vercel.app/ https://croquet-io.metered.live/; worker-src 'self' blob: data: https://*.sldunit.xyz/ https://*.vercel.app/; connect-src 'self' https://*.sldunit.xyz/ https://*.vercel.app/ wss://*.multisynq.io/ https://api.multisynq.io/ https://croquet-io.metered.live/ wss://croquet-io.metered.live/ https://*.multisynq.io/; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.sldunit.xyz/; frame-src 'self' https://vercel.live/; frame-ancestors 'self' https://vercel.live/",
    },
  },
})
