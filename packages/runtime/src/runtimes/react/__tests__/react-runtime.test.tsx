/** @jest-environment jsdom */
import { type MouseEvent } from 'react'
import {
  Checkbox,
  Combobox,
  Color,
  Image,
  Link,
  List,
  Number,
  Select,
  Shape,
  TextArea,
  TextInput,
} from '../../../controls'

import { ComponentRegistration, ReactRuntime } from '../react-runtime'
import { getReactComponent } from '../../../state/react-page'
import { CLIENT_REFERENCE_TAG } from '../utils/is-client-reference'

type Card = {
  imageSrc?: string
  imageAlt: string
  title: string
  text: string
  link: {
    href: string
    onClick: (event: MouseEvent) => void
  }
}

type Entity = {
  id: number
  name: string
}

function Sandbox(props: {
  cards: Card[]
  entityId?: Entity['id']
  theme: 'light' | 'dark'
  background: string
  boolean: boolean
  number?: number
}) {
  return <div>{JSON.stringify(props)}</div>
}

// Fabricate the object React produces for `import X from './X'` when the file starts with "use client".
function createClientReference() {
  return { $$typeof: CLIENT_REFERENCE_TAG } as unknown as ComponentRegistration<any>
}

const Component = () => <p>Hello</p>

describe('ReactRuntime.connect', () => {
  it('returns the expected registration object', () => {
    // Arrange
    const meta = {
      type: 'component',
      label: 'Component',
    }

    // Act
    const reg = ReactRuntime.connect(Component, meta)

    // Assert
    expect(reg).toEqual({
      component: Component,
      meta: expect.objectContaining(meta),
    })
  })
})

describe('ReactRuntime()', () => {
  it('accepts components registration', () => {
    // Arrange
    const type = 'component'
    const component = ReactRuntime.connect(Component, {
      type,
      label: 'Component',
    })

    // Act
    const runtime = new ReactRuntime({
      components: { component },
    })

    // Assert
    const state = runtime.store.getState()
    expect(getReactComponent(state, type)).toBeDefined()
    expect(getReactComponent(state, 'random-type')).toBeNull()
  })

  it('throws an error when a component is a client reference', () => {
    // Arrange
    const clientRef = createClientReference()

    // Act
    // Assert
    expect(() => {
      new ReactRuntime({ components: { button: clientRef } })
    }).toThrow('ReactRuntime: failed to register component')
  })
})

describe('registerComponent', () => {
  test("correctly deduces control definitions' resolved value types", () => {
    const runtime = new ReactRuntime()

    runtime.registerComponent(Sandbox, {
      type: 'sandbox',
      label: 'Sandbox',
      props: {
        cards: List({
          label: 'Cards',
          type: Shape({
            type: {
              imageSrc: Image({ label: 'Image' }),
              imageAlt: TextInput({
                label: 'Alt text',
                defaultValue: 'Image',
              }),
              title: TextInput({
                label: 'Title',
                defaultValue: 'This is a title',
              }),
              text: TextArea({
                label: 'Text',
                defaultValue: 'Lorem ipsum',
              }),
              link: Link({ label: 'On click' }),
            },
          }),
          getItemLabel(item) {
            return item?.title ?? 'This is a title'
          },
        }),
        entityId: Combobox({
          async getOptions() {
            return fetch(`/api/entities`)
              .then(r => r.json())
              .then((entities: Entity[]) =>
                entities.map(entity => ({
                  id: entity.id.toString(),
                  label: entity.name,
                  value: entity.id,
                })),
              )
          },
          label: 'Entity',
        }),
        theme: Select({
          label: 'Text color',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ],
          defaultValue: 'light',
        }),
        background: Color({ label: 'Background color', defaultValue: '#fff' }),
        boolean: Checkbox({ label: 'Boolean', defaultValue: true }),
        number: Number({ label: 'Number' }),
      },
    })
  })
})
