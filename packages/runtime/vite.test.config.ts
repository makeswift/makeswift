/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    globals: true,
  },
  define: {
    'import.meta.vitest': false,
  },
})
