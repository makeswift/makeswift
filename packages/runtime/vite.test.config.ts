/// <reference types="vitest" />

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    globals: true,
  },
  define: {
    'import.meta.vitest': false,
  },
})
