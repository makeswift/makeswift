/** @jest-environment jsdom */

import { type ReactNode, useRef, act } from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { ControlInstance } from '@makeswift/controls'

import { Slot } from '../../controls'

import { createReactRuntime, ReactProvider } from '../../runtimes/react/testing'
import { Page } from '../../runtimes/react/components/page'

import { createRootComponent, createMakeswiftPageSnapshot } from '../../testing/element-data'
import { TestWorkingSiteVersion } from '../../testing/fixtures/site-version'

const TEST_ID = 'slot-test-id'

jest.mock('../../state/builder-api/proxy', () => ({
  BuilderAPIProxy: jest.fn(() => ({
    setup: () => () => {},
    execute: () => {},
  })),
}))

function SlotValue(props: { control: ControlInstance }) {
  const renderCount = useRef(0)
  ++renderCount.current

  return (
    <div
      data-testid={TEST_ID}
      data-render-count={renderCount.current}
      data-instance-key={JSON.stringify(props.control?.instanceKey)}
    >
      Slot placeholder
    </div>
  )
}

jest.mock('../../runtimes/react/controls/slot', () => ({
  renderSlot: (props: { control: ControlInstance }) => <SlotValue {...props} />,
}))

function SlotTest({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

describe('Slot', () => {
  const createFixtures = () => {
    const componentType = 'slot-test'

    const runtime = createReactRuntime()
    runtime.registerComponent(SlotTest, {
      type: componentType,
      label: 'Slot Test',
      props: {
        children: Slot(),
      },
    })

    const testElementTree = (component: ReactNode, { draft }: { draft: boolean }) => (
      <ReactProvider runtime={runtime} siteVersion={draft ? TestWorkingSiteVersion : null}>
        {component}
      </ReactProvider>
    )

    const elementKey = '11111111-1111-1111-1111-111111111111'
    const elementData = {
      key: elementKey,
      props: {},
      type: componentType,
    }

    const snapshot = createMakeswiftPageSnapshot(createRootComponent([elementData]))
    return { snapshot, elementKey, testElementTree }
  }

  test('renders with a null control instance on live pages', async () => {
    const { snapshot, testElementTree } = createFixtures()
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />, { draft: false })))

    const renderedInstanceKey = screen.getByTestId(TEST_ID).dataset['instanceKey']
    expect(JSON.parse(renderedInstanceKey ?? 'null')).toBe(null)
  })

  test('renders with a corresponding control instance when editing', async () => {
    const { snapshot, elementKey, testElementTree } = createFixtures()
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />, { draft: true })))

    const element = screen.getByTestId(TEST_ID)
    const renderedInstanceKey = element.dataset['instanceKey']
    expect(JSON.parse(renderedInstanceKey ?? 'null')).toEqual({
      elementKey,
      propPath: 'children',
    })

    const renderCount = element.dataset['renderCount']
    expect(renderCount).toBe('1')
  })
})
