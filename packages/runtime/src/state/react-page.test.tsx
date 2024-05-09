/** @jsxRuntime classic */
/** @jsx jsx */
import { TextInput } from '@makeswift/controls'

import { Slot } from '../controls'
import { registerComponent } from './actions'
import * as ReactPage from './react-page'
import { ComponentIcon } from './modules/components-meta'

// @ts-ignore Used by JSX pragma
function jsx(type: Function, props: Record<string, unknown> = {}, ...children: JSX.Element[]) {
  return type({
    ...props,
    children:
      children.length === 0
        ? props.children ?? []
        : children.length === 1
        ? children.at(0)
        : children,
  })
}

const ElementType = {
  Box: 'box',
  Button: 'button',
} as const

type ElementType = typeof ElementType[keyof typeof ElementType]

function Box({ key, children }: { key: string; children?: JSX.Element | JSX.Element[] }) {
  const elements = children == null ? [] : [children].flat()

  return { type: ElementType.Box, key, props: { children: { elements } } }
}

function Button({ key, children }: { key: string; children?: string }) {
  return { type: ElementType.Button, key, props: { children } }
}

function SlotTombstone({ type, key }: { type: ElementType; key: string }) {
  return { type, key, props: {}, deleted: true }
}

function render(element: JSX.Element): ReactPage.ElementData {
  return element as ReactPage.ElementData
}

function createTestStore(): ReactPage.Store {
  const store = ReactPage.configureStore()

  store.dispatch(
    registerComponent(
      ElementType.Box,
      { label: 'Box', icon: ComponentIcon.Cube, hidden: false },
      { children: Slot() },
    ),
  )

  store.dispatch(
    registerComponent(
      ElementType.Button,
      { label: 'Button', icon: ComponentIcon.Cube, hidden: false },
      { children: TextInput() },
    ),
  )

  return store
}

describe('ReactPage', () => {
  const store = createTestStore()

  describe('merge', () => {
    test('changing a prop', () => {
      // Arrange
      const base = render(
        <Box key="root">
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
          <Box key="boxB">
            <Button key="buttonB">Button B</Button>
          </Box>
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
        </Box>,
      )
      const override = render(
        <Box key="root">
          <Box key="boxB">
            <Button key="buttonB">Button 2</Button>
          </Box>
        </Box>,
      )
      const merged = render(
        <Box key="root">
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
          <Box key="boxB">
            <Button key="buttonB">Button 2</Button>
          </Box>
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
        </Box>,
      )

      // Act
      const result = ReactPage.mergeElement(store.getState(), base, override)

      // Assert
      expect(result).toEqual(merged)
    })

    // TODO: At what index is the element inserted?
    test.skip('adding an element', () => {
      // Arrange
      const base = render(
        <Box key="root">
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
          <Box key="boxB">
            <Button key="buttonB">Button B</Button>
          </Box>
        </Box>,
      )
      const override = render(
        <Box key="root">
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
        </Box>,
      )
      const merged = render(
        <Box key="root">
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
          <Box key="boxB">
            <Button key="buttonB">Button B</Button>
          </Box>
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
        </Box>,
      )

      // Act
      const result = ReactPage.mergeElement(store.getState(), base, override)

      // Assert
      expect(result).toEqual(merged)
    })

    test('deleting an element', () => {
      // Arrange
      const base = render(
        <Box key="root">
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
          <Box key="boxB">
            <Button key="buttonB">Button B</Button>
          </Box>
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
        </Box>,
      )
      const override = render(
        <Box key="root">
          <SlotTombstone type={ElementType.Box} key="boxB" />
        </Box>,
      )
      const merged = render(
        <Box key="root">
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
        </Box>,
      )

      // Act
      const result = ReactPage.mergeElement(store.getState(), base, override)

      // Assert
      expect(result).toEqual(merged)
    })

    // TODO: Into what index is the element sorted?
    test.skip('elements sorted in Slot', () => {
      // Arrange
      const base = render(
        <Box key="root">
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
          <Box key="boxB">
            <Button key="buttonB">Button B</Button>
          </Box>
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
        </Box>,
      )
      const override = render(
        <Box key="root">
          <Box key="boxC" />
          <Box key="boxB" />
          <Box key="boxA" />
        </Box>,
      )
      const merged = render(
        <Box key="root">
          <Box key="boxC">
            <Button key="buttonC">Button C</Button>
          </Box>
          <Box key="boxB">
            <Button key="buttonB">Button B</Button>
          </Box>
          <Box key="boxA">
            <Button key="buttonA">Button A</Button>
          </Box>
        </Box>,
      )

      // Act
      const result = ReactPage.mergeElement(store.getState(), base, override)

      // Assert
      expect(result).toEqual(merged)
    })
  })
})
