import { defineConfig, Options } from 'tsup'
import pkg from './package.json'

const deps = Object.keys({
  ...pkg.peerDependencies,
  // If we add any deps, make sure to comment this out
  // ...pkg.dependencies,
  ...pkg.devDependencies,
})

export default defineConfig(
  (options: Options): Options => ({
    treeshake: false,
    splitting: false,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: deps,
    ...options,
  }),
)
