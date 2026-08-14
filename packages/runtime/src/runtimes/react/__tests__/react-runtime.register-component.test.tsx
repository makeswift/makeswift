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
  ContextValue,
  Select,
  Shape,
  TextArea,
  TextInput,
} from '../../../controls'

import { createReactRuntime } from '../testing/react-runtime'

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

const runtime = createReactRuntime()

describe('registerComponent', () => {
  test("correctly deduces control definitions' resolved value types", () => {
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

describe('options context validation', () => {
  // Enforced entirely by `ValidComponentProps` on `registerComponent`'s `props`,
  // so these assert compile-time behaviour: the bodies only have to run.
  const stateNameContext = ContextValue('stateName').withType<string>()

  const stateCombobox = () =>
    Combobox({
      provides: stateNameContext,
      getOptions: (query: string) => [{ id: query, value: query, label: query }],
    })

  const cityCombobox = () =>
    Combobox({
      dependsOn: { selectedState: stateNameContext },
      getOptions: (_query, _context) => [],
    })

  function Noop() {
    return <div />
  }

  test('accepts a provider and a consumer in the same component', () => {
    createReactRuntime().registerComponent(Noop, {
      type: 'valid-wiring',
      label: 'Valid',
      props: { stateName: stateCombobox(), cityName: cityCombobox() },
    })
  })

  test('rejects a context with more than one provider', () => {
    createReactRuntime().registerComponent(Noop, {
      type: 'duplicate-providers',
      label: 'Duplicate',
      props: {
        // @ts-expect-error — `stateName` is provided twice
        stateName: stateCombobox(),
        // @ts-expect-error — `stateName` is provided twice
        alsoStateName: stateCombobox(),
      },
    })
  })

  test('rejects a provider inside a List', () => {
    createReactRuntime().registerComponent(Noop, {
      type: 'fan-out-provider',
      label: 'Fan out',
      props: {
        // @ts-expect-error — a List provider has one value per item
        stops: List({ type: stateCombobox() }),
      },
    })
  })

  test('rejects a context with no provider', () => {
    createReactRuntime().registerComponent(Noop, {
      type: 'unprovided-context',
      label: 'Unprovided',
      // @ts-expect-error — nothing provides `stateName`
      props: { cityName: cityCombobox() },
    })
  })
})
