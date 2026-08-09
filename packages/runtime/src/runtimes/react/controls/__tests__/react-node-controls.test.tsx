/** @jest-environment jsdom */

import { type ReactNode, type PropsWithChildren, useRef, act } from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import {
  ControlDefinition,
  ControlInstance,
  Stylesheet,
  type ControlInstanceKey,
  type Data,
} from '@makeswift/controls'

import { RichText, Slot, Group, List, TextInput, RichTextV2Definition } from '../../../../controls'

import { createReactRuntime, ReactProvider } from '../../testing'
import { Page } from '../../components/page'

import { setResolvedValueOverride } from '../../../../state/actions/internal/read-write-actions'
import { RichTextV2Value } from '../rich-text-v2/rich-text-v2-value'
import { SlotValue } from '../slot/slot-value'

import { createRootComponent, createMakeswiftPageSnapshot } from '../../../../testing/element-data'
import { TestWorkingSiteVersion } from '../../../../testing/fixtures/site-version'

const TEST_ID = 'test-id'

const noOpStylesheet: Stylesheet = {
  breakpoints: () => [],
  defineStyle: () => '',
  child: () => noOpStylesheet,
  key: () => '',
}

jest.mock('../../../../state/builder-api/proxy', () => ({
  BuilderAPIProxy: jest.fn(() => ({
    setup: () => () => {},
    execute: () => {},
  })),
}))

function NodeValueWrapper({
  instanceKey,
  children,
}: PropsWithChildren<{ instanceKey: ControlInstanceKey | undefined }>) {
  const renderCount = useRef(0)
  ++renderCount.current

  return (
    <div
      data-testid={TEST_ID}
      data-render-count={renderCount.current}
      data-instance-key={JSON.stringify(instanceKey)}
    >
      {children}
    </div>
  )
}

jest.mock('../slot/render-slot', () => ({
  renderSlot: ({ control }: { control: ControlInstance | null }) => {
    const instanceKey = control?.instanceKey
    return (
      <NodeValueWrapper instanceKey={instanceKey}>
        <SlotValue instanceKey={instanceKey} data={undefined} config={{}} />
      </NodeValueWrapper>
    )
  },
}))

jest.mock('../rich-text-v2/render-rich-text-v2', () => ({
  renderRichTextV2: ({ control }: { control: ControlInstance | null }) => {
    const instanceKey = control?.instanceKey
    return (
      <NodeValueWrapper instanceKey={instanceKey}>
        <RichTextV2Value
          instanceKey={instanceKey}
          data={undefined}
          config={{
            defaultValue: 'One fish, two fish',
          }}
          parentStylesheet={noOpStylesheet}
        />
      </NodeValueWrapper>
    )
  },
}))

function TestComponent({
  group: { list },
}: {
  group: { list: { title?: string; nodeProp: ReactNode }[] }
}) {
  return (
    <div>
      {list.map(({ title, nodeProp }, i) => (
        <div key={i}>
          <h1>{title}</h1>
          {nodeProp}
        </div>
      ))}
    </div>
  )
}

const createFixtures = ({
  draft = false,
  propDef,
  propData,
}: {
  draft?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propDef: ControlDefinition<string, any, any, any, ReactNode>
  propData: Data
}) => {
  const componentType = 'react-node-prop-test'
  const groupProp = Group({
    props: {
      list: List({
        type: Group({
          props: {
            title: TextInput(),
            nodeProp: propDef,
          },
        }),
      }),
    },
  })

  const runtime = createReactRuntime()
  runtime.registerComponent(TestComponent, {
    type: componentType,
    label: 'React Node Prop Test',
    props: {
      group: groupProp,
    },
  })

  const siteVersion = draft ? TestWorkingSiteVersion : null
  const store = runtime.getOrCreateStore({ siteVersion, locale: undefined })

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
        list: [{ title: 'item 1', nodeProp: propData }],
      }),
    },
    type: componentType,
  }

  const snapshot = createMakeswiftPageSnapshot(createRootComponent([elementData]))

  return { store, snapshot, elementKey, testElementTree }
}

describe.each([
  [Slot(), { elements: [], columns: [] }],
  [RichText(), RichTextV2Definition.nodesToDataV2([])],
])('%s prop rendering', (propDef, propData) => {
  test('renders with a null control instance on live pages', async () => {
    const { snapshot, testElementTree } = createFixtures({ propDef, propData })
    await act(async () => render(testElementTree(<Page snapshot={snapshot} />)))

    const renderedInstanceKey = screen.getByTestId(TEST_ID).dataset['instanceKey']
    expect(JSON.parse(renderedInstanceKey ?? 'null')).toBe(null)
  })

  test('renders with a corresponding control instance when editing', async () => {
    const { snapshot, elementKey, testElementTree } = createFixtures({
      draft: true,
      propDef,
      propData,
    })

    await act(async () => render(testElementTree(<Page snapshot={snapshot} />)))

    const element = screen.getByTestId(TEST_ID)
    const renderedInstanceKey = element.dataset['instanceKey']
    expect(JSON.parse(renderedInstanceKey ?? 'null')).toEqual({
      elementKey,
      propPath: 'group.list.0.nodeProp',
    })

    const renderCount = element.dataset['renderCount']
    expect(renderCount).toBe('1')
  })

  test('renders resolved value override when present', async () => {
    const { store, snapshot, elementKey, testElementTree } = createFixtures({
      draft: true,
      propDef,
      propData,
    })

    await act(async () => render(testElementTree(<Page snapshot={snapshot} />)))

    await act(() =>
      store.dispatch(
        setResolvedValueOverride({
          documentKey: 'test-page-id',
          instanceKey: { elementKey, propPath: 'group.list.0.nodeProp' },
          value: <div>Node value override</div>,
        }),
      ),
    )

    const element = screen.getByTestId(TEST_ID)
    expect(element?.innerHTML).toEqual('<div>Node value override</div>')
  })
})
