import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/cache', '@emotion/server'],
  },
  ssr: {
    noExternal: ['@makeswift/runtime', '@makeswift/react-router'],
  },
})
