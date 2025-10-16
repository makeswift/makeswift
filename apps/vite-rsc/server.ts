import express from 'express'
import { createServer as createViteServer } from 'vite'
import {
  createApiHandler,
  createPreviewMiddleware,
} from '@makeswift/express-react/server'
import { runtime } from './src/makeswift/runtime'
import { client } from './src/makeswift/client'
import { MAKESWIFT_SITE_API_KEY } from './src/makeswift/env'

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  // Add Makeswift API middleware
  app.use(
    createApiHandler(MAKESWIFT_SITE_API_KEY!, {
      runtime,
      apiOrigin: process.env.VITE_MAKESWIFT_API_ORIGIN,
      appOrigin: process.env.VITE_MAKESWIFT_APP_ORIGIN,
    }),
  )
  app.use(createPreviewMiddleware({ client }))

  // Add Vite's middleware
  app.use(vite.middlewares)

  // Start server
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

createServer().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
