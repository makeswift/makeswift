/** @jest-environment jsdom */

import { type PropsWithChildren, type ReactNode, act } from 'react'
import { renderHook } from '@testing-library/react'

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

const createFixture = () => {
  const runtime = createReactRuntime()
  const renderRSCElement = jest.fn<Promise<ReactNode>, [unknown]>()
  const initialNode = <div>Initial server render</div>

  const wrapper = ({ children }: PropsWithChildren) => (
    <ReactProvider runtime={runtime} siteVersion={TestWorkingSiteVersion}>
      <DocumentKeyContext.Provider value={documentKey}>
        <DocumentLocaleContext.Provider value={null}>
          <FrameworkContextProvider value={{ renderRSCElement }}>
            <ServerElementsCache value={new Map([[elementKey, initialNode]])}>
              {children}
            </ServerElementsCache>
          </FrameworkContextProvider>
        </DocumentLocaleContext.Provider>
      </DocumentKeyContext.Provider>
    </ReactProvider>
  )

  const renderResult = renderHook(
    () => {
      const serverRefresh = useServerElementRefresh({ elementKey })
      const { getElement } = useServerElementsCache()

      return { serverRefresh, renderedElement: getElement(elementKey) }
    },
    { wrapper },
  )

  return { ...renderResult, renderRSCElement }
}

describe('useServerElementRefresh', () => {
  test('applies each response when requests resolve in order', async () => {
    const { result, renderRSCElement } = createFixture()
    const firstResponse = createDeferred<ReactNode>()
    const secondResponse = createDeferred<ReactNode>()

    renderRSCElement.mockImplementationOnce(() => firstResponse.promise)
    renderRSCElement.mockImplementationOnce(() => secondResponse.promise)

    const firstRefresh = result.current.serverRefresh(elementData)
    const secondRefresh = result.current.serverRefresh(elementData)

    const firstNode = <div>First server render</div>
    await act(async () => {
      firstResponse.resolve(firstNode)
      expect(await firstRefresh).toBe(true)
    })

    expect(result.current.renderedElement).toBe(firstNode)

    const secondNode = <div>Second server render</div>
    await act(async () => {
      secondResponse.resolve(secondNode)
      expect(await secondRefresh).toBe(true)
    })

    expect(result.current.renderedElement).toBe(secondNode)
  })

  test('ignores an older response that resolves after a newer response', async () => {
    const { result, renderRSCElement } = createFixture()
    const firstResponse = createDeferred<ReactNode>()
    const secondResponse = createDeferred<ReactNode>()

    renderRSCElement.mockImplementationOnce(() => firstResponse.promise)
    renderRSCElement.mockImplementationOnce(() => secondResponse.promise)

    const firstRefresh = result.current.serverRefresh(elementData)
    const secondRefresh = result.current.serverRefresh(elementData)

    const secondNode = <div>Second server render</div>
    await act(async () => {
      secondResponse.resolve(secondNode)
      expect(await secondRefresh).toBe(true)
    })

    const firstNode = <div>First server render</div>
    await act(async () => {
      firstResponse.resolve(firstNode)
      expect(await firstRefresh).toBe(false)
    })

    expect(result.current.renderedElement).toBe(secondNode)
  })

  test('ignores a response that resolves after unmount', async () => {
    const { result, renderRSCElement, unmount } = createFixture()
    const pending = createDeferred<ReactNode>()

    renderRSCElement.mockImplementationOnce(() => pending.promise)
    const refresh = result.current.serverRefresh(elementData)

    unmount()
    pending.resolve(<div>Late server render</div>)

    await expect(refresh).resolves.toBe(false)
  })
})
