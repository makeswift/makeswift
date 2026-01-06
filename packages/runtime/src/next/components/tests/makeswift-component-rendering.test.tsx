/** @jest-environment jsdom */

import { Suspense, act } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { ReactRuntime } from '../../../react'
import * as Testing from '../../testing'
import { MakeswiftComponent } from '../../../runtimes/react/components/MakeswiftComponent'
import { type MakeswiftComponentSnapshot } from '../../../client'

import { Checkbox, TextInput } from '@makeswift/controls'
import { ComponentType } from '../../../state/react-page'

const CustomComponentType = 'CustomComponent'
const componentId = 'component-id'
const containerId = 'container-id'
const fallbackId = 'fallback-id'

type ComponentProps = {
  text: string
  suspend: boolean
}

function CustomComponent({ text, suspend }: ComponentProps) {
  if (suspend) {
    throw new Promise(() => {}) // suspend indefinitely
  }

  return <div data-testid={componentId}>{text}</div>
}

function CustomComponentWithFallback(props: ComponentProps) {
  return (
    <Suspense fallback={<div data-testid={fallbackId}>Loading...</div>}>
      <CustomComponent {...props} />
    </Suspense>
  )
}

const elementData = (props: { text: string; suspend?: boolean }) => ({
  type: CustomComponentType,
  key: '0000-0000-0000-0000',
  props,
})

async function renderComponentSnapshot(
  snapshot: MakeswiftComponentSnapshot,
  component: ComponentType<ComponentProps> = CustomComponent,
  { builtinSuspense }: { builtinSuspense?: boolean } = {},
) {
  const runtime = new ReactRuntime()

  runtime.registerComponent(component, {
    type: CustomComponentType,
    label: 'Custom Component',
    builtinSuspense,
    props: {
      text: TextInput({ defaultValue: 'Default Text' }),
      suspend: Checkbox({ defaultValue: false, label: 'Suspend' }),
    },
  })

  await act(async () =>
    render(
      <Testing.ReactProvider runtime={runtime} siteVersion={null}>
        <div data-testid={containerId}>
          <MakeswiftComponent
            label="Embedded Component"
            type={CustomComponentType}
            snapshot={snapshot}
          />
        </div>
      </Testing.ReactProvider>,
    ),
  )
}

describe('MakeswiftComponent', () => {
  test('empty snapshot renders component with default props', async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(null)

    await renderComponentSnapshot(snapshot)

    expect(screen.queryByTestId(componentId)).toHaveTextContent('Default Text')
  })

  test('existing snapshot renders component with saved props', async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(elementData({ text: 'Hello World' }))

    await renderComponentSnapshot(snapshot)

    expect(screen.queryByTestId(componentId)).toHaveTextContent('Hello World')
  })

  test('suspended component renders a null fallback', async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(
      elementData({ text: 'Hello World', suspend: true }),
    )

    await renderComponentSnapshot(snapshot)

    expect(screen.queryByTestId(containerId)).toBeEmptyDOMElement()
  })

  test("suspended component registered with 'builtinSuspense: false' renders its own fallback", async () => {
    const snapshot = Testing.createMakeswiftComponentSnapshot(
      elementData({ text: 'Hello World', suspend: true }),
    )

    await renderComponentSnapshot(snapshot, CustomComponentWithFallback, {
      builtinSuspense: false,
    })

    expect(screen.queryByTestId(fallbackId)).toHaveTextContent('Loading...')
  })
})
