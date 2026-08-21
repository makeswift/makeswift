/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'

import { useClientCSS } from '../../css/client-css'

import { ServerElementsProvider, useServerElementsCache } from '../server-elements-cache'

test('provides both the server elements cache and the client CSS context', () => {
  function Consumer() {
    // Throws if the client CSS provider is missing from the tree
    useClientCSS()

    return useServerElementsCache().getElement('element')
  }

  render(
    <ServerElementsProvider
      elements={new Map([['element', <div key="element">Server element</div>]])}
    >
      <Consumer />
    </ServerElementsProvider>,
  )

  expect(screen.getByText('Server element')).toBeInTheDocument()
})
