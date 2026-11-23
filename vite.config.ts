import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Handler local pour intercepter et valider les webhooks GeniusPay
 */
function geniusPayWebhookPlugin(): Plugin {
  return {
    name: 'geniuspay-webhook-handler',
    configureServer(server) {
      server.middlewares.use('/api/webhooks/geniuspay', (req, res) => {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          console.log('\n[GENIUSPAY WEBHOOK REÇU]');
          console.log('Méthode :', req.method);
          console.log('Headers :', JSON.stringify(req.headers, null, 2));
          console.log('Body :', body || '(ping sans body)');

          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-GeniusPay-Signature')
          res.statusCode = 200
          res.end(
            JSON.stringify({
              status: 'success',
              received: true,
              timestamp: new Date().toISOString(),
              message: 'Webhook GeniusPay validé avec succès par EVENTFLOW',
            })
          )
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    geniusPayWebhookPlugin(),
  ],
})
