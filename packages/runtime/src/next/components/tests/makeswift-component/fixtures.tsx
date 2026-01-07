import { Suspense, act } from 'react'
import { render } from '@testing-library/react'

import { ReactRuntime } from '../../../../react'
import * as Testing from '../../../testing'
import { MakeswiftComponent } from '../../../../runtimes/react/components/MakeswiftComponent'
import { type MakeswiftComponentSnapshot } from '../../../../client'

import { Checkbox, TextInput } from '@makeswift/controls'
import { ComponentType } from '../../../../state/react-page'

export const CustomComponentType = 'CustomComponent'
export const componentId = 'component-id'
export const containerId = 'container-id'
export const fallbackId = 'fallback-id'

export type ComponentProps = {
  text: string
  suspend: boolean
}

export function CustomComponent({ text, suspend }: ComponentProps) {
  if (suspend) {
    throw new Promise(() => {}) // suspend indefinitely
  }

  return <div data-testid={componentId}>{text}</div>
}

export function CustomComponentWithFallback(props: ComponentProps) {
  return (
    <Suspense fallback={<div data-testid={fallbackId}>Loading...</div>}>
      <CustomComponent {...props} />
    </Suspense>
  )
}

export const elementData = (props: { text: string; suspend?: boolean }) => ({
  type: CustomComponentType,
  key: '0000-0000-0000-0000',
  props,
})

export async function renderComponentSnapshot(
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
