import { type ReactNode, Fragment, forwardRef, useRef, isValidElement } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ServerInsertedHTMLContext } from 'next/navigation'

import { type Data, type ValueType, type DataType, ControlDefinition } from '@makeswift/controls'

import { type CacheData } from '../../../../api/react'
import { ElementData } from '../../../../state/react-page'
import { ReactRuntime } from '../../../../react'
import { MakeswiftComponent } from '../../MakeswiftComponent'
import { Page } from '../../page'
import { isServer } from '../../../../utils/is-server'
import * as Testing from '../../../../runtimes/react/testing'

const ROOT_ID = '00000000-0000-0000-0000-000000000000'
const ELEMENT_ID = '11111111-1111-1111-1111-111111111111'

const renderProp = (prop: any) =>
  prop === undefined ? 'undefined' : isValidElement(prop) ? prop : JSON.stringify(prop)

const propSnapshot = (prop: HTMLElement | null) =>
  prop?.childElementCount ? prop.childNodes : parseStringifiedProp(prop?.textContent ?? '')

const parseStringifiedProp = (prop: string) => (prop === 'undefined' ? undefined : JSON.parse(prop))

async function streamToString(stream: ReadableStream) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  let result = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    result += decoder.decode(value, { stream: true })
  }

  return result
}

async function renderToString(element: ReactNode) {
  return await streamToString(await renderToReadableStream(element))
}

async function serverSideRender(children: ReactNode) {
  // wrap the children in a context provider to capture server-inserted HTML, see
  // https://github.com/vercel/next.js/blob/canary/packages/next/src/server/app-render/server-inserted-html.tsx
  const serverInsertedCallbacks: (() => React.ReactNode)[] = []

  const elementTree = (
    <ServerInsertedHTMLContext.Provider value={handler => serverInsertedCallbacks.push(handler)}>
      {children}
    </ServerInsertedHTMLContext.Provider>
  )

  const elementsHTML = await renderToString(elementTree)

  const serverInsertedNodes = serverInsertedCallbacks.map((callback, index) => (
    <Fragment key={'__next_server_inserted__' + index}>{callback()}</Fragment>
  ))

  const headHTML = await renderToString(serverInsertedNodes)

  const dom = new JSDOM(
    `<!DOCTYPE html><head>${headHTML}</head><body><div id="root">${elementsHTML}</div></body></div>`,
    {
      runScripts: 'dangerously',
    },
  )

  return dom.window.document
}

export async function testPageControlPropRendering<D extends ControlDefinition>(
  controlDefinition: D,
  {
    toData,
    value,
    locale,
    cacheData,
    expectedRenders,
    registerComponents,
    action,
    rootElements = [],
  }: {
    toData?: (value: ValueType<D>) => DataType<D>
    value: ValueType<D> | undefined
    locale?: string | null
    cacheData?: Partial<CacheData>
    expectedRenders?: number
    registerComponents?: (runtime: ReactRuntime) => void
    action?: (element: HTMLElement) => Promise<void>
    rootElements?: ElementData[]
  },
) {
  // Arrange
  const controlData: DataType<D> | Data =
    value !== undefined ? (toData ? toData(value) : controlDefinition.toData(value)) : undefined

  const testComponentMeta = {
    type: 'TestComponent',
    label: 'Test Component',
  }

  const testId = 'test-id'
  const renderCountTestId = 'render-count-test-id'
  const elementData: ElementData = {
    key: ELEMENT_ID,
    type: testComponentMeta.type,
    props: {
      propKey: controlData,
    },
  }

  const runtime = new ReactRuntime()
  registerComponents?.(runtime)

  // Act
  runtime.registerComponent(
    forwardRef<HTMLDivElement, { propKey?: any }>(({ propKey }, ref) => {
      const renderCount = useRef(0)
      ++renderCount.current

      return (
        <div ref={ref}>
          <div data-testid={renderCountTestId}>{renderCount.current}</div>
          <div data-testid={testId}>{renderProp(propKey)}</div>
        </div>
      )
    }),
    {
      ...testComponentMeta,
      props: {
        propKey: controlDefinition as any,
      },
    },
  )

  const testElementTree = (component: ReactNode) => (
    <Testing.ReactProvider runtime={runtime}>{component}</Testing.ReactProvider>
  )

  if (!isServer()) {
    const rootElementData: ElementData = Testing.createRootComponent(
      [elementData, ...rootElements],
      ROOT_ID,
    )

    const snapshot = Testing.createMakeswiftPageSnapshot(rootElementData, { locale, cacheData })

    // Assert
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />)))

    if (action) {
      await act(async () => {
        await action(screen.getByTestId(testId))
      })
    }

    expect(snapshot).toMatchSnapshot('snapshot')
    expect(propSnapshot(screen.getByTestId(testId))).toMatchSnapshot('resolvedValue')

    if (expectedRenders != null) {
      expect(Number(screen.getByTestId(renderCountTestId).textContent)).toBe(expectedRenders)
    }
  } else {
    // test server-side rendering using a component snapshot
    console.assert(action == null)
    console.assert(rootElements.length === 0)

    const snapshot = Testing.createMakeswiftComponentSnapshot(elementData, { locale, cacheData })
    const elementTree = testElementTree(
      <MakeswiftComponent snapshot={snapshot} {...testComponentMeta} />,
    )

    const document = await serverSideRender(elementTree)
    const getByTestId = (id: string): HTMLElement | null =>
      document.querySelector(`[data-testid="${id}"]`)

    expect(propSnapshot(getByTestId(testId))).toMatchSnapshot('resolvedValue')
    expect([...document.querySelectorAll('style')].map(n => n.textContent)).toMatchSnapshot(
      'component styles',
    )
    expect(Number(getByTestId(renderCountTestId)?.textContent)).toBe(1)
  }
}
