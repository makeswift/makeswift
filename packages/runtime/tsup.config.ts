import { defineConfig, Options } from 'tsup'
import { version } from './package.json'

export default defineConfig(() => {
  const commonOptions: Options = {
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/__tests__/**',
      '!src/slate/test-helpers/**',
    ],
    bundle: false,
    minify: false,
    sourcemap: true,
    legacyOutput: true,
    define: {
      PACKAGE_VERSION: JSON.stringify(version),
    },
  }

  const esmOptions: Options = {
    ...commonOptions,
    format: 'esm',
  }

  const cjsOptions: Options = {
    ...commonOptions,
    format: 'cjs',
    outDir: 'dist/cjs',
  }

  return [esmOptions, cjsOptions]
})
