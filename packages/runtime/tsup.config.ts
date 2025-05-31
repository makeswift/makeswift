import { defineConfig, Options } from 'tsup'
import { version } from './package.json'

export default defineConfig(() => {
  const commonOptions = {
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/__tests__/**',
      '!src/slate/test-helpers/**',
    ],
    bundle: false,
    minify: false,
    sourcemap: true,
    define: {
      PACKAGE_VERSION: JSON.stringify(version),
    },
    esbuildOptions(options, { format }) {
      if (format === 'cjs') options.supported = { ...options.supported, 'dynamic-import': false }
    },
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.cjs',
      }
    },
  } satisfies Options

  const esmOptions: Options = {
    ...commonOptions,
    entry: [...commonOptions.entry, '!src/next/plugin.ts'],
    format: 'esm',
    outDir: 'dist/esm',
  }

  const cjsOptions: Options = {
    ...commonOptions,
    format: 'cjs',
    outDir: 'dist/cjs',
  }

  return [esmOptions, cjsOptions]
})
