import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import pkg from './package.json'

const deps = Object.keys({
  ...pkg.peerDependencies,
  ...pkg.dependencies,
  ...pkg.devDependencies,
})

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    // NOTE(miguel): `lib.entry` is unused since we provide `rollupOptions.input`.
    lib: { entry: '', formats: ['es', 'cjs'] },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src'),
        ['prop-controllers']: path.resolve(__dirname, 'src', 'prop-controllers'),
        react: path.resolve(__dirname, 'src', 'react'),
        ['box-model']: path.resolve(__dirname, 'src', 'box-model'),
        components: path.resolve(__dirname, 'src', 'components'),
        api: path.resolve(__dirname, 'src', 'api'),
        next: path.resolve(__dirname, 'src', 'next'),
        builder: path.resolve(__dirname, 'src', 'builder'),
        controls: path.resolve(__dirname, 'src', 'controls'),
        slate: path.resolve(__dirname, 'src', 'slate'),
        ['state/breakpoints']: path.resolve(__dirname, 'src', 'state', 'modules', 'breakpoints'),
      },
      output: {
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
      },
      external: new RegExp(`^(${deps.join('|')})($|\/)`),
    },
  },
})
