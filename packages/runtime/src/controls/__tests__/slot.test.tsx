/** @jest-environment jsdom */

import { type ReactNode, useRef, act } from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { ControlInstance, type ControlInstanceKey } from '@makeswift/controls'

import { Slot, Group, List, TextInput } from '../../controls'

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

function SlotValue({ instanceKey }: { instanceKey: ControlInstanceKey | undefined }) {
  const renderCount = useRef(0)
  ++renderCount.current

  return (
    <div
      data-testid={TEST_ID}
      data-render-count={renderCount.current}
      data-instance-key={JSON.stringify(instanceKey)}
    >
      Slot placeholder
    </div>
  )
}

jest.mock('../../runtimes/react/controls/slot/render-slot', () => ({
  renderSlot: ({ control }: { control: ControlInstance | null }) => (
    <SlotValue instanceKey={control?.instanceKey} />
  ),
}))

function TestComponent({
  group: { list },
}: {
  group: { list: { title?: string; slot: ReactNode }[] }
}) {
  return (
    <div>
      {list.map(({ title, slot }, i) => (
        <div key={i}>
          <h1>{title}</h1>
          {slot}
        </div>
      ))}
    </div>
  )
}

describe('Slot', () => {
  const createFixtures = () => {
    const componentType = 'slot-test'
    const groupProp = Group({
      props: {
        list: List({
          type: Group({
            props: {
              title: TextInput(),
              slot: Slot(),
            },
          }),
        }),
      },
    })

    const runtime = createReactRuntime()
    runtime.registerComponent(TestComponent, {
      type: componentType,
      label: 'Slot Test',
      props: {
        group: groupProp,
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
      props: {
        group: groupProp.toData({
          list: [{ title: 'item 1', slot: { elements: [], columns: [] } }],
        }),
      },
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
      propPath: 'group.list.0.slot',
    })

    const renderCount = element.dataset['renderCount']
    expect(renderCount).toBe('1')
  })
})
