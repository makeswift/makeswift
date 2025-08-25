import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router'

import styled from '@emotion/styled'

import './app.css'

const Container = styled('div')`
  padding: 1em;
`

export const meta = () => [
  {
    charset: 'utf-8',
  },
  {
    title: 'Remix with Makeswift',
  },
  {
    viewport: 'width=device-width,initial-scale=1',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    // known HTTP error
    const { status, statusText } = error
    const title = `HTTP ${status}${statusText ? `: ${statusText}` : ''}`

    return (
      <Container>
        <h1>{title}</h1>
      </Container>
    )
  }

  let errorMessage = 'Unknown error'
  if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <Container>
      <h1>Snap, something went wrong!</h1>
      <p>{errorMessage}</p>
    </Container>
  )
}
