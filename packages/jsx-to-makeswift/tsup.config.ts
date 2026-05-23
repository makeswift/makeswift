import { defineConfig, Options } from 'tsup'

export default defineConfig(() => {
  const commonOptions = {
    entry: [
      'src/**/*.ts',
      '!src/**/*.test.ts',
      '!src/**/__tests__/**',
      '!src/cli.ts',
    ],
    bundle: false,
    minify: false,
    sourcemap: true,
    legacyOutput: true,
    esbuildOptions(options, { format }) {
      if (format === 'cjs')
        options.supported = { ...options.supported, 'dynamic-import': false }
    },
  } satisfies Options

  const esmOptions: Options = {
    ...commonOptions,
    entry: [...commonOptions.entry],
    format: 'esm',
  }

  const cjsOptions: Options = {
    ...commonOptions,
    format: 'cjs',
    outDir: 'dist/cjs',
  }

  const cliOptions: Options = {
    entry: ['src/cli.ts'],
    outDir: 'dist',
    format: 'cjs',
    bundle: true,
    minify: false,
    sourcemap: false,
    platform: 'node',
    target: 'node18',
    banner: {
      js: '#!/usr/bin/env node',
    },
    noExternal: [/.*/],
    external: ['fs', 'path'],
  }

  return [esmOptions, cjsOptions, cliOptions]
})
