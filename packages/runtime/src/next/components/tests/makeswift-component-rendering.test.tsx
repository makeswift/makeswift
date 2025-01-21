/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import { ReactRuntime } from '../../../react'
import { ReactRuntimeProvider } from '../../../runtimes/react'
import { MakeswiftComponent } from '../MakeswiftComponent'
import {
  type MakeswiftComponentSnapshotMetadata,
  type MakeswiftComponentDocument,
  type MakeswiftComponentDocumentFallback,
  type MakeswiftComponentSnapshot,
} from '../../client'
import { type CacheData } from '../../../api/react'
import { TextInput } from '@makeswift/controls'

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
  inheritsFromParent: false,
}

function createMakeswiftComponentSnapshot(
  document: MakeswiftComponentDocumentFallback | MakeswiftComponentDocument,
  meta: MakeswiftComponentSnapshotMetadata,
  cacheData: CacheData = {
    apiResources: {},
    localizedResourcesMap: {},
  },
): MakeswiftComponentSnapshot {
  return {
    document,
    cacheData,
    key: '00000000-0000-0000-0000-000000000000',
    meta,
  }
}

async function testMakeswiftComponentRendering(snapshot: MakeswiftComponentSnapshot) {
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
      <ReactRuntimeProvider runtime={runtime} previewMode={false}>
        <MakeswiftComponent
          label="Embedded Component"
          type={CustomComponentType}
          snapshot={snapshot}
        />
      </ReactRuntimeProvider>,
    ),
  )
}

describe('MakeswiftComponent', () => {
  test('empty snapshot renders component with default props', async () => {
    const snapshot = createMakeswiftComponentSnapshot(emptyDocumentFixture, {
      allowLocaleFallback: false,
      requestedLocale: null,
    })
    await testMakeswiftComponentRendering(snapshot)

    expect(screen.queryByTestId(customComponentContentTestId)).toHaveTextContent('Default Text')
  })

  test('existing snapshot renders component with saved props', async () => {
    const snapshot = createMakeswiftComponentSnapshot(existingDocumentFixture, {
      allowLocaleFallback: false,
      requestedLocale: null,
    })
    await testMakeswiftComponentRendering(snapshot)

    expect(screen.queryByTestId(customComponentContentTestId)).toHaveTextContent('Hello World')
  })
})
