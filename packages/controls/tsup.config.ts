import { defineConfig, Options } from 'tsup'

export default defineConfig(() => {
  const commonOptions = {
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/__tests__/**',
    ],
    bundle: false,
    minify: false,
    sourcemap: true,
  } satisfies Options

  const esmOptions: Options = {
    ...commonOptions,
    entry: [...commonOptions.entry],
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
