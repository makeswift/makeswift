/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  type OptionsType,
  Types,
  type Descriptor,
  type PropDef,
  type Value,
} from '@makeswift/prop-controllers'

import { type ElementData, type ComponentType } from '../../../../state/react-page'
import { randomUUID } from 'crypto'

import { Page } from '../../page'
import { act } from 'react-dom/test-utils'
import { ReactRuntime } from '../../../../react'
import * as Testing from '../../../testing'

export const pagePropControllerTest = <
  P extends PropDef & ((options?: any) => any),
  C extends ComponentType<{ propKey: Value<P> | undefined }>,
>(
  propDef: P,
  value: Value<typeof propDef>,
  component: (testId: string) => C,
  assert: (element: HTMLElement) => void,
  options?: OptionsType<P>,
) =>
  describe('Page', () => {
    test(`can render ${propDef.type} v0 data`, async () => {
      // Arrange
      const descriptorV0: Descriptor<typeof propDef> = {
        type: propDef.type,
        options,
      }

      const TestComponentType = 'TestComponent'
      const testId = 'test-id'

      const elementData: ElementData = Testing.createRootComponent([
        {
          key: randomUUID(),
          type: TestComponentType,
          props: {
            propKey: propDef.toPropData(value, descriptorV0),
          },
        },
      ])
      const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
      const runtime = new ReactRuntime()

      runtime.registerComponent(component(testId), {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          propKey: propDef(options),
        },
      })

      await act(async () =>
        render(
          <Testing.ReactProvider runtime={runtime}>
            <Page snapshot={snapshot} />
          </Testing.ReactProvider>,
        ),
      )

      assert(screen.getByTestId(testId))
    })

    test(`can render ${propDef.type} v1 data`, async () => {
      // Arrange
      const gapXDefinitionV1: Descriptor<typeof propDef> = {
        type: Types.GapX,
        version: 1,
        options: {},
      }

      const TestComponentType = 'TestComponent'
      const testId = 'test-id'
      const elementData: ElementData = Testing.createRootComponent([
        {
          key: randomUUID(),
          type: TestComponentType,
          props: {
            propKey: propDef.toPropData(value, gapXDefinitionV1),
          },
        },
      ])
      const snapshot = Testing.createMakeswiftPageSnapshot(elementData)
      const runtime = new ReactRuntime()

      runtime.registerComponent(component(testId), {
        type: TestComponentType,
        label: 'TestComponent',
        props: {
          propKey: propDef(options),
        },
      })

      await act(async () =>
        render(
          <Testing.ReactProvider runtime={runtime}>
            <Page snapshot={snapshot} />
          </Testing.ReactProvider>,
        ),
      )

      assert(screen.getByTestId(testId))
    })
  })
