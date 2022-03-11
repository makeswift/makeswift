import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup'
import * as path from 'path'

export default defineConfig({
  plugins: [svgr(), react()],
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
      },
      output: {
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
      },
      external: id => {
        const regExp = /^(next|react|react-dom|slate|slate-react|styled-components)($|\/)/

        return regExp.test(id)
      },
    },
  },
})
