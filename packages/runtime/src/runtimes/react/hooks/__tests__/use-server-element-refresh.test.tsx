/** @jest-environment jsdom */

import { type ReactNode, StrictMode, act, useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { TestWorkingSiteVersion } from '../../../../testing/fixtures/site-version'
import { type ElementData } from '../../../../state/read-only-state'

import { FrameworkContextProvider } from '../../components/framework-context'
import { createReactRuntime, ReactProvider } from '../../testing'
import {
  ServerElementsCache,
  useServerElementsCache,
} from '../../server/components/server-elements-cache'

import { DocumentKeyContext, DocumentLocaleContext } from '../use-document-context'
import { useServerElementRefresh } from '../use-server-element-refresh'

import { createDeferred } from '../../../../utils/deferred'

jest.mock('../../../../state/builder-api/proxy', () => ({
  BuilderAPIProxy: jest.fn(() => ({
    setup: () => () => {},
    execute: jest.fn(),
  })),
}))

const elementKey = 'test-element-key'
const documentKey = 'test-document-key'
const elementData: ElementData = { key: elementKey, type: 'TestComponent', props: {} }

const createFixture = ({
  initialNode = <div>Initial server render</div>,
}: { initialNode?: ReactNode } = {}) => {
  const runtime = createReactRuntime()
  const renderRSCElement = jest.fn<Promise<ReactNode>, [unknown]>()

  const initialElementsMap = new Map([[elementKey, initialNode]])
  let serverRefresh: ReturnType<typeof useServerElementRefresh> | null = null

  function Requester() {
    serverRefresh = useServerElementRefresh({ elementKey })
    return null
  }

  function Observer() {
    return useServerElementsCache().getElement(elementKey)
  }

  const wrapper = ({
    requesterKey = 'initial',
    elementsMap = initialElementsMap,
  }: {
    requesterKey?: string | null
    elementsMap?: Map<string, ReactNode>
  } = {}) => (
    <StrictMode>
      <ReactProvider runtime={runtime} siteVersion={TestWorkingSiteVersion}>
        <DocumentKeyContext.Provider value={documentKey}>
          <DocumentLocaleContext.Provider value={null}>
            <FrameworkContextProvider value={{ renderRSCElement }}>
              <ServerElementsCache value={elementsMap}>
                {requesterKey != null && <Requester key={requesterKey} />}
                <Observer />
              </ServerElementsCache>
            </FrameworkContextProvider>
          </DocumentLocaleContext.Provider>
        </DocumentKeyContext.Provider>
      </ReactProvider>
    </StrictMode>
  )

  const renderedTree = render(wrapper())
  return {
    renderRSCElement,
    unmount: renderedTree.unmount,
    rerender: (options: Parameters<typeof wrapper>[0]) => renderedTree.rerender(wrapper(options)),
    refresh: (onCommitted?: () => void) => {
      if (serverRefresh == null) throw new Error('Requester is not mounted')
      return serverRefresh(elementData, onCommitted)
    },
  }
}

describe('useServerElementRefresh', () => {
  test('applies each response when requests resolve in order', async () => {
    const { renderRSCElement, refresh } = createFixture()
    const firstResponse = createDeferred<ReactNode>()
    const secondResponse = createDeferred<ReactNode>()

    renderRSCElement.mockImplementationOnce(() => firstResponse.promise)
    renderRSCElement.mockImplementationOnce(() => secondResponse.promise)

    const firstOnCommitted = jest.fn()
    const secondOnCommitted = jest.fn()
    const firstRefresh = refresh(firstOnCommitted)
    const secondRefresh = refresh(secondOnCommitted)

    const firstNode = <div>First server render</div>
    await act(async () => {
      firstResponse.resolve(firstNode)
      await firstRefresh
    })

    expect(screen.getByText('First server render')).toBeInTheDocument()
    expect(firstOnCommitted).toHaveBeenCalledTimes(1)

    const secondNode = <div>Second server render</div>
    await act(async () => {
      secondResponse.resolve(secondNode)
      await secondRefresh
    })

    expect(screen.getByText('Second server render')).toBeInTheDocument()
    expect(secondOnCommitted).toHaveBeenCalledTimes(1)
  })

  test('ignores an older response that resolves after a newer response', async () => {
    const { renderRSCElement, refresh } = createFixture()
    const firstResponse = createDeferred<ReactNode>()
    const secondResponse = createDeferred<ReactNode>()

    renderRSCElement.mockImplementationOnce(() => firstResponse.promise)
    renderRSCElement.mockImplementationOnce(() => secondResponse.promise)

    const firstOnCommitted = jest.fn()
    const secondOnCommitted = jest.fn()
    const firstRefresh = refresh(firstOnCommitted)
    const secondRefresh = refresh(secondOnCommitted)

    const secondNode = <div>Second server render</div>
    await act(async () => {
      secondResponse.resolve(secondNode)
      await secondRefresh
    })

    const firstNode = <div>First server render</div>
    await act(async () => {
      firstResponse.resolve(firstNode)
      await firstRefresh
    })

    expect(screen.getByText('Second server render')).toBeInTheDocument()
    expect(firstOnCommitted).not.toHaveBeenCalled()
    expect(secondOnCommitted).toHaveBeenCalledTimes(1)
  })

  test('preserves child state through the first refresh', async () => {
    function StatefulElement({ value }: { value: string }) {
      const [count, setCount] = useState(0)
      return <button onClick={() => setCount(count => count + 1)}>{`${value}:${count}`}</button>
    }

    const { renderRSCElement, refresh } = createFixture({
      initialNode: <StatefulElement key="element" value="Initial" />,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Initial:0' }))
    renderRSCElement.mockResolvedValueOnce(<StatefulElement key="element" value="Refreshed" />)

    await act(async () => refresh())

    expect(screen.getByRole('button', { name: 'Refreshed:1' })).toBeInTheDocument()
  })

  test('ignores a response that resolves after the cache provider unmounts', async () => {
    const { renderRSCElement, unmount, refresh } = createFixture()
    const pending = createDeferred<ReactNode>()

    renderRSCElement.mockImplementationOnce(() => pending.promise)
    const onCommitted = jest.fn()
    const pendingRefresh = refresh(onCommitted)

    unmount()
    pending.resolve(<div>Late server render</div>)

    await pendingRefresh
    expect(onCommitted).not.toHaveBeenCalled()
  })

  test('keeps an in-flight refresh alive when its requester unmounts (e.g. element reparenting)', async () => {
    const { renderRSCElement, refresh, rerender } = createFixture()
    const pending = createDeferred<ReactNode>()
    renderRSCElement.mockReturnValueOnce(pending.promise)

    const onCommitted = jest.fn()
    const request = refresh(onCommitted)

    // force unmounting/remounting of the requester
    rerender({ requesterKey: null })
    const node = <div>Completed after unmounting</div>
    await act(async () => {
      pending.resolve(node)
      await request
    })

    expect(screen.getByText('Completed after unmounting')).toBeInTheDocument()
    expect(onCommitted).toHaveBeenCalledTimes(1)
  })

  test.each([true, false])(
    'shares ordering across requester remounts (newer response first: %s)',
    async newerFirst => {
      const { renderRSCElement, refresh, rerender } = createFixture()
      const older = createDeferred<ReactNode>()
      const newer = createDeferred<ReactNode>()
      renderRSCElement.mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise)

      const olderOnCommitted = jest.fn()
      const newerOnCommitted = jest.fn()
      const olderRequest = refresh(olderOnCommitted)

      rerender({ requesterKey: 'remounted' })

      const newerRequest = refresh(newerOnCommitted)
      const olderNode = <div>Older</div>
      const newerNode = <div>Newer</div>

      if (!newerFirst) {
        await act(async () => {
          older.resolve(olderNode)
          await olderRequest
        })

        expect(screen.getByText('Older')).toBeInTheDocument()
      }

      await act(async () => {
        newer.resolve(newerNode)
        await newerRequest
      })

      if (newerFirst) {
        await act(async () => {
          older.resolve(olderNode)
          await olderRequest
        })
      }

      expect(screen.getByText('Newer')).toBeInTheDocument()
      expect(newerOnCommitted).toHaveBeenCalledTimes(1)
      expect(olderOnCommitted).toHaveBeenCalledTimes(newerFirst ? 0 : 1)
    },
  )

  test('rejects response after cache has been updated with a new elements map, even when the requester stays mounted', async () => {
    const { renderRSCElement, refresh, rerender } = createFixture()
    const previousTree = createDeferred<ReactNode>()
    const currentTree = createDeferred<ReactNode>()

    renderRSCElement
      .mockReturnValueOnce(previousTree.promise)
      .mockReturnValueOnce(currentTree.promise)

    const previousOnCommitted = jest.fn()
    const currentOnCommitted = jest.fn()
    // initiate a refresh request
    const previousRequest = refresh(previousOnCommitted)

    // replace the elements map creating a new cache scope
    const rscNode = <div>New node</div>
    rerender({ elementsMap: new Map([[elementKey, rscNode]]) })

    // start a refresh associated with the new cache scope
    const currentRequest = refresh(currentOnCommitted)

    // response from the previous scope should be ignored
    await act(async () => {
      previousTree.resolve(<div>Stale node</div>)
      await previousRequest
    })

    expect(screen.getByText('New node')).toBeInTheDocument()
    expect(previousOnCommitted).not.toHaveBeenCalled()

    // response from the current scope should update the cached node
    const refreshedNode = <div>Refreshed node</div>
    await act(async () => {
      currentTree.resolve(refreshedNode)
      await currentRequest
    })

    expect(screen.getByText('Refreshed node')).toBeInTheDocument()
    expect(currentOnCommitted).toHaveBeenCalledTimes(1)
  })
})
