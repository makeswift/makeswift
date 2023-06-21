import { Options, defineConfig } from 'tsup'
import svgr from 'esbuild-plugin-svgr'
import jsx from '@svgr/plugin-jsx';
import pkg from './package.json'

const deps = new Set(
  Object.keys({
    ...pkg.peerDependencies,
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }),
)

export default defineConfig(
  (options: Options): Options => ({
    esbuildPlugins: [svgr({ svgo: false, plugins: [jsx] })],
    treeshake: false,
    splitting: false,
    // If false, this will output `.mjs` files which our dependencies don't support yet
    legacyOutput: true,
    clean: false,
    sourcemap: true,
    minify: false,
    entry: [
      'src/index.ts',
      'src/prop-controllers/index.ts',
      'src/react.ts',
      'src/box-model.ts',
      'src/components/index.ts',
      'src/api/index.ts',
      'src/next/index.tsx',
      'src/builder/index.ts',
      'src/controls/index.ts',
      'src/slate/index.ts',
      'src/state/modules/breakpoints.ts',
    ],
    esbuildOptions: (options) => {
      if (options.define) {
        // TODO: Remove this once we extract tests out of the code
        options.define['import.meta.vitest'] = JSON.stringify(false);
      }
    },
    format: ['esm', 'cjs'],
    external: Array.from(deps),
    ...options,
  }),
)
