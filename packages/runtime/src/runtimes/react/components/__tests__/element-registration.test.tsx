/** @jest-environment jsdom */

import { type ReactNode, act } from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { http, HttpResponse } from 'msw'

import { server } from '../../../../mocks/server'

import { Style } from '../../../../controls'
import { type SiteVersion } from '../../../../api/site-version'

import { createReactRuntime, ReactProvider } from '../../testing'
import { Page } from '../page'
import { getPropControllers, getPropControllersHandle } from '../../../../state/read-write-state'
import { type Element } from '../../../../state/read-only-state'
import { isReadWriteState } from '../../../../state/unified-state'
import { ElementImperativeHandle } from '../../element-imperative-handle'

import { createRootComponent, createMakeswiftPageSnapshot } from '../../../../testing/element-data'
import { TestWorkingSiteVersion } from '../../../../testing/fixtures/site-version'
import { expectReadWriteState } from '../../../../testing/read-write-state'

const ROOT_COMPONENT_KEY = '00000000-0000-0000-0000-111111111111'
const TEST_ID = 'html-test-id'

const BuilderAPIProxyExecute = jest.fn(() => {})

jest.mock('../../../../state/builder-api/proxy', () => ({
  BuilderAPIProxy: jest.fn(() => ({
    setup: () => () => {},
    execute: BuilderAPIProxyExecute,
  })),
}))

function TestComponent({ className }: { className: string }) {
  return (
    <div data-testid={TEST_ID} className={className}>
      This is a test
    </div>
  )
}

describe('Element registration', () => {
  beforeEach(() => {
    BuilderAPIProxyExecute.mockClear()
  })

  const createFixtures = ({ elementReference }: { elementReference?: boolean } = {}) => {
    const runtime = createReactRuntime()

    const componentType = 'element-registration-test'
    runtime.registerComponent(TestComponent, {
      type: componentType,
      label: 'Element Registration Test',
      props: {
        className: Style(),
      },
    })

    const testElementTree = (component: ReactNode, siteVersion: SiteVersion | null) => (
      <ReactProvider runtime={runtime} siteVersion={siteVersion}>
        {component}
      </ReactProvider>
    )

    const globalElement = {
      __typename: 'GlobalElement',
      id: 'global-element-id',
      data: { type: componentType, key: 'global-key-1', props: {} },
    }

    if (elementReference) {
      server.use(
        http.get(`/api/makeswift/global-elements/${globalElement.id}`, () =>
          HttpResponse.json(globalElement, { status: 200 }),
        ),
      )
    }

    const elementKey = '11111111-1111-1111-1111-111111111111'
    const element: Element = elementReference
      ? {
          key: elementKey,
          type: 'reference',
          value: globalElement.id,
        }
      : {
          key: elementKey,
          props: {},
          type: componentType,
        }

    const snapshot = createMakeswiftPageSnapshot(createRootComponent([element], ROOT_COMPONENT_KEY))
    const fullElementKey = { documentKey: snapshot.document.id, elementKey }

    return { runtime, snapshot, fullElementKey, testElementTree, globalElement }
  }

  test.each([false, true])(
    'does not register element prop controllers and handles on live pages (element reference: %s)',
    async elementReference => {
      const { runtime, snapshot, fullElementKey, testElementTree } = createFixtures({
        elementReference,
      })

      const siteVersion = null
      await act(async () => render(testElementTree(<Page snapshot={snapshot} />, siteVersion)))

      const state = runtime.getOrCreateStore({ siteVersion, locale: undefined }).getState()
      expect(isReadWriteState(state) ? getPropControllers(state, fullElementKey) : null).toBe(null)
      expect(isReadWriteState(state) ? getPropControllersHandle(state, fullElementKey) : null).toBe(
        null,
      )
      expect(BuilderAPIProxyExecute).not.toHaveBeenCalled()
    },
  )

  test('registers element data prop controllers and handles when editing', async () => {
    const { runtime, snapshot, fullElementKey, testElementTree } = createFixtures()
    const siteVersion = TestWorkingSiteVersion
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />, siteVersion)))

    const state = runtime.getOrCreateStore({ siteVersion, locale: undefined }).getState()
    expectReadWriteState(state)

    const propControllers = getPropControllers(state, fullElementKey)
    expect(propControllers).not.toBe(null)

    const handle = getPropControllersHandle(state, fullElementKey)
    expect(handle).toBeInstanceOf(ElementImperativeHandle)
    expect((handle as ElementImperativeHandle).getDomNode()?.innerHTML).toEqual('This is a test')
  })

  test('does not register reference or global element prop controllers and handles when editing', async () => {
    const { runtime, snapshot, fullElementKey, testElementTree, globalElement } = createFixtures({
      elementReference: true,
    })

    const siteVersion = TestWorkingSiteVersion

    expect(BuilderAPIProxyExecute).not.toHaveBeenCalled()

    await act(async () => render(testElementTree(<Page snapshot={snapshot} />, siteVersion)))

    // make sure we actually rendered the referenced global component
    const renderedGlobalElement = screen.getByTestId(TEST_ID)
    expect(renderedGlobalElement.innerHTML).toEqual('This is a test')

    const state = runtime.getOrCreateStore({ siteVersion, locale: undefined }).getState()
    expectReadWriteState(state)

    expect(getPropControllers(state, fullElementKey)).toBe(null)
    expect(getPropControllersHandle(state, fullElementKey)).toBe(null)
    expect(
      getPropControllersHandle(state, {
        ...fullElementKey,
        elementKey: globalElement.data.key,
      }),
    ).toBe(null)
  })

  test.each([false, true])(
    'dispatches MOUNT_COMPONENT to the builder when editing (element reference: %s)',
    async elementReference => {
      const { runtime, snapshot, testElementTree, fullElementKey } = createFixtures({
        elementReference,
      })

      const siteVersion = TestWorkingSiteVersion

      await act(async () => render(testElementTree(<Page snapshot={snapshot} />, siteVersion)))

      runtime.getOrCreateStore({ siteVersion, locale: undefined }).getState()
      expect(BuilderAPIProxyExecute).toHaveBeenCalledTimes(2)

      expect(BuilderAPIProxyExecute).toHaveBeenNthCalledWith(1, {
        type: 'MOUNT_COMPONENT',
        payload: fullElementKey,
      })

      expect(BuilderAPIProxyExecute).toHaveBeenNthCalledWith(2, {
        type: 'MOUNT_COMPONENT',
        payload: {
          documentKey: fullElementKey.documentKey,
          elementKey: ROOT_COMPONENT_KEY,
        },
      })
    },
  )
})
