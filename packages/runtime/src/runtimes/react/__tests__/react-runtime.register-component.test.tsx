/** @jest-environment jsdom */
import { forwardRef, type ForwardedRef, type MouseEvent } from 'react'
import {
  Checkbox,
  Combobox,
  Color,
  Group,
  Image,
  Link,
  List,
  Number,
  unstable_ContextValue,
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

type SandboxProps = {
  cards: Card[]
  entityId?: Entity['id']
  theme: 'light' | 'dark'
  background: string
  boolean: boolean
  number?: number
}

function Sandbox(props: SandboxProps) {
  return <div>{JSON.stringify(props)}</div>
}

const SandboxWithRef = forwardRef(function SandboxWithRef(
  props: SandboxProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return <div ref={ref}>{JSON.stringify(props)}</div>
})

function SandboxWithIncorrectRef(props: SandboxProps & { ref?: number }) {
  return <div>{JSON.stringify(props)}</div>
}

function ServerSandbox(props: SandboxProps & { widgetId: string }) {
  return <div>{JSON.stringify(props)}</div>
}

const runtime = createReactRuntime()

const sandboxProps = {
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
  text: TextInput({ label: 'Text' }),
}

describe('registerComponent', () => {
  test("correctly deduces control definitions' resolved value types", () => {
    runtime.registerComponent(Sandbox, {
      type: 'sandbox',
      label: 'Sandbox',
      props: sandboxProps,
    })

    runtime.registerComponent(SandboxWithRef, {
      type: 'sandbox-with-ref',
      label: 'SandboxWithRef',
      props: sandboxProps,
    })
  })

  test('rejects registration of a component with a React-incompatible `ref` prop', () => {
    // @ts-expect-error Types of property ref are incompatible
    runtime.registerComponent(SandboxWithIncorrectRef, {
      type: 'sandbox-with-ref',
      label: 'SandboxWithRef',
      props: sandboxProps,
    })
  })

  test('specified injected server props are type-checked against the component props', () => {
    runtime.registerComponent(ServerSandbox, {
      type: 'server-sandbox',
      label: 'ServerSandbox',
      props: sandboxProps,
      server: {
        unstable_injectedProps: {
          widgetId: 'elementKey',
        },
      },
    })

    // @ts-expect-error Property widgetId is missing in type
    runtime.registerComponent(ServerSandbox, {
      type: 'invalid-server-sandbox',
      label: 'InvalidServerSandbox',
      props: sandboxProps,
      server: {
        unstable_injectedProps: {
          gadgetId: 'elementKey',
        },
      },
    })
  })
})

describe('options context validation', () => {
  // Enforced entirely by `ValidComponentProps` on `registerComponent`'s `props`,
  // so these assert compile-time behaviour: the bodies only have to run.
  const stateNameContext = unstable_ContextValue('stateName').ofType<string>()

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

  test('accepts an item-scoped provider inside a List', () => {
    createReactRuntime().registerComponent(Noop, {
      type: 'item-scoped-provider',
      label: 'Item scoped',
      props: {
        places: List({
          type: Group({
            props: { stateName: stateCombobox(), cityName: cityCombobox() },
          }),
        }),
      },
    })
  })

  test('rejects a List provider that shadows an outer provider', () => {
    createReactRuntime().registerComponent(Noop, {
      type: 'shadowing-provider',
      label: 'Shadowing',
      props: {
        // @ts-expect-error — `stateName` is also provided inside the List
        stateName: stateCombobox(),
        // @ts-expect-error — `stateName` is also provided in the enclosing scope
        stateNames: List({ type: stateCombobox() }),
      },
    })
  })

  test('rejects a consumer outside the List of an item-scoped provider', () => {
    createReactRuntime().registerComponent(Noop, {
      type: 'out-of-scope-consumer',
      label: 'Out of scope',
      props: {
        stateNames: List({ type: stateCombobox() }),
        // @ts-expect-error — the item-scoped provider is not visible outside
        cityName: cityCombobox(),
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
