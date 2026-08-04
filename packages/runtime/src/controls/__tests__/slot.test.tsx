/** @jest-environment jsdom */

import { type ReactNode, useRef, act } from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { ControlInstance, type ControlInstanceKey } from '@makeswift/controls'

import { Slot, Group, List, TextInput } from '../../controls'

import { createReactRuntime, ReactProvider } from '../../runtimes/react/testing'
import { Page } from '../../runtimes/react/components/page'

import { setResolvedValueOverride } from '../../state/actions/internal/read-write-actions'
import { SlotValue } from '../../runtimes/react/controls/slot/slot-value'

import { createRootComponent, createMakeswiftPageSnapshot } from '../../testing/element-data'
import { TestWorkingSiteVersion } from '../../testing/fixtures/site-version'

const TEST_ID = 'slot-test-id'

jest.mock('../../state/builder-api/proxy', () => ({
  BuilderAPIProxy: jest.fn(() => ({
    setup: () => () => {},
    execute: () => {},
  })),
}))

function SlotValueWrapper({ instanceKey }: { instanceKey: ControlInstanceKey | undefined }) {
  const renderCount = useRef(0)
  ++renderCount.current

  return (
    <div
      data-testid={TEST_ID}
      data-render-count={renderCount.current}
      data-instance-key={JSON.stringify(instanceKey)}
    >
      <SlotValue instanceKey={instanceKey} data={undefined} config={{}} />
    </div>
  )
}

jest.mock('../../runtimes/react/controls/slot/render-slot', () => ({
  renderSlot: ({ control }: { control: ControlInstance | null }) => (
    <SlotValueWrapper instanceKey={control?.instanceKey} />
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
  const createFixtures = ({ draft }: { draft?: boolean } = {}) => {
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

    const siteVersion = draft ? TestWorkingSiteVersion : null
    const testElementTree = (component: ReactNode) => (
      <ReactProvider runtime={runtime} siteVersion={siteVersion}>
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
    return { runtime, siteVersion, snapshot, elementKey, testElementTree }
  }

  test('renders with a null control instance on live pages', async () => {
    const { snapshot, testElementTree } = createFixtures()
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />)))

    const renderedInstanceKey = screen.getByTestId(TEST_ID).dataset['instanceKey']
    expect(JSON.parse(renderedInstanceKey ?? 'null')).toBe(null)
  })

  test('renders with a corresponding control instance when editing', async () => {
    const { snapshot, elementKey, testElementTree } = createFixtures({ draft: true })
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />)))

    const element = screen.getByTestId(TEST_ID)
    const renderedInstanceKey = element.dataset['instanceKey']
    expect(JSON.parse(renderedInstanceKey ?? 'null')).toEqual({
      elementKey,
      propPath: 'group.list.0.slot',
    })

    const renderCount = element.dataset['renderCount']
    expect(renderCount).toBe('1')
  })

  test('renders resolved value override when present', async () => {
    const { runtime, siteVersion, snapshot, elementKey, testElementTree } = createFixtures({
      draft: true,
    })
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />)))

    const store = runtime.getOrCreateStore({ siteVersion, locale: undefined })
    await act(() =>
      store.dispatch(
        setResolvedValueOverride({
          documentKey: 'test-page-id',
          instanceKey: { elementKey, propPath: 'group.list.0.slot' },
          value: <div>Slot value override</div>,
        }),
      ),
    )

    const element = screen.getByTestId(TEST_ID)
    expect(element?.innerHTML).toEqual('<div>Slot value override</div>')
  })
})
