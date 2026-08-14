import { defineConfig, Options } from 'tsup'
import { version } from './package.json'

export default defineConfig(() => {
  const commonOptions = {
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/__tests__/**',
      '!src/slate/test-helpers/**',
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
    entry: [...commonOptions.entry, '!src/next/plugin.ts'],
    format: 'esm',
  }

  const cjsOptions: Options = {
    ...commonOptions,
    entry: [...commonOptions.entry, '!src/api/ky.ts'],
    format: 'cjs',
    outDir: 'dist/cjs',
  }

  // `ky` is ESM-only, so a `require('ky')` left in our CommonJS output throws
  // `ERR_REQUIRE_ESM` on hosts whose loader doesn't implement `require(esm)`.
  // Every `ky` import goes through `src/api/ky.ts`, which we bundle for CJS,
  // since the ESM output can import `ky` as-is.
  const cjsKyOptions: Options = {
    ...commonOptions,
    entry: { 'api/ky': 'src/api/ky.ts' },
    bundle: true,
    noExternal: ['ky'],
    format: 'cjs',
    outDir: 'dist/cjs',
  }

  return [esmOptions, cjsOptions, cjsKyOptions]
})
