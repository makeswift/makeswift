/** @jest-environment jsdom */

import { type ReactNode, act } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { type Operation, type ReadOnlySnapshot } from 'ot-json0'

import { type ControlDefinition, type Data } from '@makeswift/controls'

import { Slot, TextInput, List, Group } from '../../../../../controls'
import { TestWorkingSiteVersion } from '../../../../../testing/fixtures/site-version'
import { expectReadWriteState } from '../../../../../testing/read-write-state'
import { changeDocument } from '../../../../../state/host-api'
import { createBaseDocument, type ElementData } from '../../../../../state/read-only-state'
import { getPropControllers, hasResolvedValueOverride } from '../../../../../state/read-write-state'
import { registerDocument } from '../../../../../state/shared-api'
import { setResolvedValueOverride } from '../../../../../state/actions/internal/read-write-actions'

import { Document } from '../../../components/Document'
import { FrameworkContextProvider } from '../../../components/framework-context'
import { createReactRuntime, ReactProvider } from '../../../testing'
import { ClientCSSProvider } from '../../css/client-css'

import { ServerElementsCache } from '../server-elements-cache'

jest.mock('../../../../../state/builder-api/proxy', () => ({
  BuilderAPIProxy: jest.fn(() => ({
    setup: () => () => {},
    execute: jest.fn(),
  })),
}))

const elementKey = 'test-element-key'
const documentKey = 'test-document-key'
const componentType = 'TestComponent'
const instanceKey = (propPath: string) => ({ elementKey, propPath })

const createFixtures = async ({
  propDefs,
  propsData,
  serverNode = <div>Initial server render</div>,
}: {
  propDefs: Record<string, ControlDefinition>
  propsData: Record<string, Data>
  serverNode?: ReactNode
}) => {
  const runtime = createReactRuntime({ env: 'rsc' })
  runtime.registerComponent(() => null, {
    type: componentType,
    label: 'Test server component',
    server: true,
    props: propDefs,
  })

  const store = runtime.getOrCreateStore({
    siteVersion: TestWorkingSiteVersion,
    locale: undefined,
  })

  const initialElementData: ElementData = {
    key: elementKey,
    type: componentType,
    props: propsData,
  }

  const document = createBaseDocument(documentKey, initialElementData, null)
  store.dispatch(registerDocument(document))

  const renderRSCElement = jest.fn<Promise<ReactNode>, [unknown]>()

  render(
    <ReactProvider runtime={runtime} siteVersion={TestWorkingSiteVersion}>
      <FrameworkContextProvider value={{ renderRSCElement }}>
        <ServerElementsCache value={new Map([[elementKey, serverNode]])}>
          <ClientCSSProvider>
            <Document document={document} />
          </ClientCSSProvider>
        </ServerElementsCache>
      </FrameworkContextProvider>
    </ReactProvider>,
  )

  await waitFor(() => {
    const state = store.getState()
    expectReadWriteState(state)
    expect(getPropControllers(state, { documentKey, elementKey })).not.toBeNull()
  })

  return { renderRSCElement, store }
}

const updateProp = (propName: string, oldValue: Data, newValue: Data): Operation => [
  { p: ['props', propName], od: oldValue as ReadOnlySnapshot, oi: newValue as ReadOnlySnapshot },
]

describe('EditableServerElement', () => {
  test('existing ReactNode prop is updated through a client override', async () => {
    const initialProp = { columns: [], elements: [] }
    const { renderRSCElement, store } = await createFixtures({
      propDefs: { content: Slot() },
      propsData: {
        content: initialProp,
      },
    })

    const updatedProp = {
      ...initialProp,
      elements: [{ key: '1', type: 'component', props: {} }],
    }

    act(() => {
      store.dispatch(changeDocument(documentKey, updateProp('content', initialProp, updatedProp)))
    })

    await waitFor(() => {
      const state = store.getState()
      expectReadWriteState(state)
      expect(hasResolvedValueOverride(state, documentKey, instanceKey('content'))).toBe(true)
    })

    expect(renderRSCElement).not.toHaveBeenCalled()
  })

  test('existing nested ReactNode prop is updated through a client override', async () => {
    const group = Group({ props: { slot: Slot(), title: TextInput() } })
    const initialProp = { slot: { columns: [], elements: [] }, title: 'Before' }
    const initialData = group.toData(initialProp)

    const { renderRSCElement, store } = await createFixtures({
      propDefs: { content: group },
      propsData: { content: initialData },
    })

    const updatedProp = {
      ...initialProp,
      slot: {
        columns: [],
        elements: [{ key: '1', type: 'component', props: {} }],
      },
    }

    const updatedData = group.toData(updatedProp)

    act(() => {
      store.dispatch(changeDocument(documentKey, updateProp('content', initialData, updatedData)))
    })

    await waitFor(() => {
      const state = store.getState()
      expectReadWriteState(state)
      expect(hasResolvedValueOverride(state, documentKey, instanceKey('content'))).toBe(false)
      expect(hasResolvedValueOverride(state, documentKey, instanceKey('content.slot'))).toBe(true)
    })

    expect(renderRSCElement).not.toHaveBeenCalled()
  })

  test('a new ReactNode prop triggers a server refresh', async () => {
    const list = List({ type: Slot() })
    const initialProp = [{ columns: [], elements: [] }]
    const initialData = list.toData(initialProp)

    const { renderRSCElement, store } = await createFixtures({
      propDefs: { content: list },
      propsData: {
        content: initialData,
      },
    })

    renderRSCElement.mockResolvedValue(<div>Refreshed server render</div>)

    const updatedProp = [...initialProp, { columns: [], elements: [] }]
    const updatedData = list.toData(updatedProp)

    act(() => {
      store.dispatch(changeDocument(documentKey, updateProp('content', initialData, updatedData)))
    })

    await screen.findByText('Refreshed server render')

    expect(renderRSCElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementData: { key: elementKey, type: componentType, props: { content: updatedData } },
        documentContext: { key: documentKey, locale: undefined },
      }),
    )

    await waitFor(() => {
      const state = store.getState()
      expectReadWriteState(state)
      expect(hasResolvedValueOverride(state, documentKey, instanceKey('title'))).toBe(false)
    })
  })

  test('refreshes the server element when a non-ReactNode prop changes', async () => {
    const { renderRSCElement, store } = await createFixtures({
      propDefs: { title: TextInput() },
      propsData: { title: 'Before' },
    })

    renderRSCElement.mockResolvedValue(<div>Refreshed server render</div>)

    act(() => {
      store.dispatch(
        setResolvedValueOverride({
          documentKey,
          instanceKey: instanceKey('title'),
          value: 'stale override',
        }),
      )

      store.dispatch(changeDocument(documentKey, updateProp('title', 'Before', 'After')))
    })

    await screen.findByText('Refreshed server render')

    expect(renderRSCElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementData: { key: elementKey, type: componentType, props: { title: 'After' } },
        documentContext: { key: documentKey, locale: undefined },
      }),
    )

    await waitFor(() => {
      const state = store.getState()
      expectReadWriteState(state)
      expect(hasResolvedValueOverride(state, documentKey, instanceKey('title'))).toBe(false)
    })
  })

  test('refreshes the server element when a nested non-ReactNode prop changes', async () => {
    const group = Group({ props: { slot: Slot(), title: TextInput() } })
    const initialProp = { slot: { columns: [], elements: [] }, title: 'Before' }
    const initialData = group.toData(initialProp)

    const { renderRSCElement, store } = await createFixtures({
      propDefs: { content: group },
      propsData: { content: initialData },
    })

    const updatedProp = {
      ...initialProp,
      title: 'After',
    }

    renderRSCElement.mockResolvedValue(<div>Refreshed server render</div>)

    const updatedData = group.toData(updatedProp)

    act(() => {
      store.dispatch(changeDocument(documentKey, updateProp('content', initialData, updatedData)))
    })

    await screen.findByText('Refreshed server render')

    expect(renderRSCElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementData: { key: elementKey, type: componentType, props: { content: updatedData } },
        documentContext: { key: documentKey, locale: undefined },
      }),
    )

    await waitFor(() => {
      const state = store.getState()
      expectReadWriteState(state)
      expect(hasResolvedValueOverride(state, documentKey, instanceKey('title'))).toBe(false)
    })
  })
})
