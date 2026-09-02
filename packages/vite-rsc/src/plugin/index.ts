import { type Plugin } from 'vite'

import { MARKER_SYMBOL, replaceServerLoaders } from './transform.js'

export default function makeswiftViteRSC(): Plugin {
  return {
    name: '@makeswift/vite-rsc',

    /**
     * Removes server-component loaders wrapped in the `serverOnly` call
     * (e.g. `serverOnly(() => import('./server'))`) from non-RSC module graphs.
     *
     * Although `ReactRuntimeCore` never loads registered server components
     * outside the RSC environment, Vite would otherwise still discover these
     * imports and add the corresponding modules to client and SSR graphs.
     * Without a `server-only` guard in the server component code, this could
     * emit discoverable client chunks containing server code or statically
     * embedded secrets. With the guard, RSC import validation rejects the
     * non-RSC graph and the production build fails.
     */
    transform: {
      filter: {
        code: new RegExp(`\\b${MARKER_SYMBOL}\\b`),
      },
      handler(code, id) {
        // don't transform if it's an external module or we're compiling for RSC
        if (id.includes('/node_modules/') || this.environment.name === 'rsc') {
          return null
        }

        return replaceServerLoaders({
          code,
          ast: this.parse(code),
          replacementExpr:
            '() => Promise.reject(new Error("Attempt to load server component outside the RSC environment"))',
        })
      },
    },
  }
}
