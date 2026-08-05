import { getRenderContext, Slot } from '@makeswift/runtime/react/server'

import { MakeswiftProvider } from './lib/makeswift/provider'

import viteLogo from '/vite.svg'

import { ServerCounter } from './components/server-counter'
import { ClientCounter } from './components/client-counter'

import reactLogo from './assets/react.svg'
import './index.css'

export async function Root() {
  const { siteVersion } = getRenderContext()
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + RSC</title>
      </head>
      <body>
        <MakeswiftProvider siteVersion={siteVersion}>
          <App />
        </MakeswiftProvider>
      </body>
    </html>
  )
}

async function App() {
  const { request, client, siteVersion, locale } = getRenderContext()
  const pathname = new URL(request.url).pathname
  const snapshot = await client.getComponentSnapshot(pathname, {
    siteVersion,
    locale,
  })

  return (
    <div id="root">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev/reference/rsc/server-components"
          target="_blank"
        >
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <Slot
        snapshot={snapshot}
        label="Main content"
        fallback={
          <div>
            <h1>Vite + RSC</h1>
            <div className="card">
              <ClientCounter />
            </div>
          </div>
        }
      />

      <div className="card">
        <ServerCounter />
      </div>
      <ul className="read-the-docs">
        <li>
          Edit <code>src/client.tsx</code> to test client HMR.
        </li>
        <li>
          Edit <code>src/root.tsx</code> to test server HMR.
        </li>
        <li>
          Visit{' '}
          <a href="./_.rsc" target="_blank">
            <code>/_.rsc</code>
          </a>{' '}
          to view RSC stream payload.
        </li>
        <li>
          Visit{' '}
          <a href="/?__nojs" target="_blank">
            <code>/?__nojs</code>
          </a>{' '}
          to test server action without js enabled.
        </li>
      </ul>
    </div>
  )
}
