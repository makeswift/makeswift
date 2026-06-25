import { defineConfig, Options } from 'tsup'
import { version } from './package.json'

export default defineConfig(() => {
  const commonOptions = {
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/__tests__/**',
      '!src/jest-setup.ts',
    ],
    bundle: false,
    minify: false,
    sourcemap: true,
    legacyOutput: true,
    define: {
      PACKAGE_VERSION: JSON.stringify(version),
    },
    esbuildOptions(options, { format }) {
      if (format === 'cjs') options.supported = { ...options.supported, 'dynamic-import': false }
    },
  } satisfies Options

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
