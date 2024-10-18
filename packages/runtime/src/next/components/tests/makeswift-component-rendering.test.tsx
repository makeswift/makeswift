/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import { ReactRuntime } from '../../../react'
import { ReactRuntimeProvider } from '../../../runtimes/react'
import { MakeswiftComponent } from '../MakeswiftComponent'
import {
  type MakeswiftComponentDocument,
  type MakeswiftComponentDocumentFallback,
  type MakeswiftComponentSnapshot,
} from '../../client'
import { type CacheData } from '../../../api/react'
import { type ReactNode } from 'react'
import { TextInput } from '@makeswift/controls'

const fallbackTestId = 'fallback'
function FallbackNode() {
  return <div data-testid={fallbackTestId}>Fallback Node</div>
}

const CustomComponentType = 'CustomComponent'
const customComponentContentTestId = 'custom'
function CustomComponent({ text }: { text: string }) {
  return <div data-testid={customComponentContentTestId}>{text}</div>
}

const emptyDocumentFixture = {
  id: '0000-0000-0000-0000',
  locale: null,
  data: null,
  seed: '1111-1111-1111-1111',
}

const existingDocumentFixture = {
  id: '2222-2222-2222-2222',
  data: {
    type: CustomComponentType,
    key: '0000-0000-0000-0000',
    props: {
      text: 'Hello World',
    },
  },
  locale: null,
  name: 'Custom Component',
  siteId: '1111-1111-1111-1111',
}

function createMakeswiftComponentSnapshot(
  document: MakeswiftComponentDocumentFallback | MakeswiftComponentDocument,
  cacheData: CacheData = {
    apiResources: {},
    localizedResourcesMap: {},
  },
) {
  return {
    document,
    cacheData,
  }
}

async function testMakeswiftComponentRendering(
  snapshot: MakeswiftComponentSnapshot,
  fallback?: ReactNode,
) {
  const runtime = new ReactRuntime()

  runtime.registerComponent(CustomComponent, {
    type: CustomComponentType,
    label: 'Custom Component',
    props: {
      text: TextInput({ defaultValue: 'Default Text' }),
    },
  })

  await act(async () =>
    render(
      <ReactRuntimeProvider runtime={runtime}>
        <MakeswiftComponent
          name="Embedded Component"
          type={CustomComponentType}
          snapshot={snapshot}
          fallback={fallback}
        />
      </ReactRuntimeProvider>,
    ),
  )
}

describe('MakeswiftComponent', () => {
  describe('without fallback', () => {
    test('empty snapshot renders component with default props', async () => {
      const snapshot = createMakeswiftComponentSnapshot(emptyDocumentFixture)
      await testMakeswiftComponentRendering(snapshot)

      expect(screen.queryByTestId(customComponentContentTestId)).toHaveTextContent('Default Text')
      expect(screen.queryByTestId(fallbackTestId)).not.toBeInTheDocument()
    })

    test('existing snapshot renders component with saved props', async () => {
      const snapshot = createMakeswiftComponentSnapshot(existingDocumentFixture)
      await testMakeswiftComponentRendering(snapshot)

      expect(screen.queryByTestId(customComponentContentTestId)).toHaveTextContent('Hello World')
      expect(screen.queryByTestId(fallbackTestId)).not.toBeInTheDocument()
    })
  })

  describe('with fallback', () => {
    test('empty snapshot renders fallback component', async () => {
      const snapshot = createMakeswiftComponentSnapshot(emptyDocumentFixture)
      await testMakeswiftComponentRendering(snapshot, <FallbackNode />)

      expect(screen.queryByTestId(customComponentContentTestId)).not.toBeInTheDocument()
      expect(screen.queryByTestId(fallbackTestId)).toHaveTextContent('Fallback Node')
    })

    test('existing snapshot renders component with saved props', async () => {
      const snapshot = createMakeswiftComponentSnapshot(existingDocumentFixture)
      await testMakeswiftComponentRendering(snapshot, <FallbackNode />)

      expect(screen.queryByTestId(customComponentContentTestId)).toHaveTextContent('Hello World')
      expect(screen.queryByTestId(fallbackTestId)).not.toBeInTheDocument()
    })
  })
})
