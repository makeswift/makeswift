import { Grid, Image, Width } from '@makeswift/prop-controllers'
import {
  serializeControls,
  deserializeControls,
  isSerializedControl,
  serializeControl,
  deserializeControl,
  SerializedListControl,
  SerializedTypeaheadControl,
} from './control-serialization'
import { Checkbox, Number, Select } from '@makeswift/controls'
import type { DeserializationPlugin } from '@makeswift/controls'
import { DELETED_PROP_CONTROLLER_TYPES, ListValue, TypeaheadValue } from '../../prop-controllers/deleted'

describe('deserializeControls', () => {
  test('deserializes record of serialized controls', () => {
    // Arrange
    const controls = {
      checkbox: Checkbox({ label: 'Checkbox', defaultValue: true }),
      number: Number({ label: 'Number', defaultValue: 42 }),
      select: Select({ label: 'Select', options: [{ value: 'red', label: 'Red' }] }),
    } as const

    const [serialized, transferables] = serializeControls(controls)

    // Act
    const deserializedControls = deserializeControls(serialized)

    // Assert
    expect(Object.keys(deserializedControls)).toEqual(Object.keys(controls))
    expect(deserializedControls).toEqual(controls)

    transferables.forEach((port: any) => port.close())
  })

  test('gracefully deserializes record of serialized controls when invalid config is provided', () => {
    // Arrange
    const controls = {
      checkbox: Checkbox({ label: 'Checkbox', defaultValue: true }),
      // @ts-expect-error Semi-valid config for select: at runtime, we allow for values that can be coerced to string
      select: Select({ label: 'Select', options: [{ value: 1, label: 'Red' }] }),
      // @ts-expect-error Invalid config for checkbox, we expect a strict boolean value
      faultyCheckbox: Checkbox({ label: 'Boolean', defaultValue: 1 }),
      // @ts-expect-error Invalid config for number
      faultyNumber: Number({ label: 'Number', defaultValue: 'not a number!' }),
    } as const

    const [serialized, transferables] = serializeControls(controls)

    // Act
    const errors: Error[] = []
    const errorCallback = jest.fn().mockImplementation(e => errors.push(e))
    const deserializedControls = deserializeControls(serialized, {
      onError: errorCallback,
    })

    // Assert
    expect(Object.keys(deserializedControls)).toEqual(['checkbox', 'select'])
    expect(errorCallback).toHaveBeenCalledTimes(2)
    expect(errors).toMatchSnapshot()

    transferables.forEach((port: any) => port.close())
  })
})

describe('isSerializedControl', () => {
  test.each([serializeControl(Grid()), serializeControl(Width()), serializeControl(Image())])(
    `returns true for serialized prop-controllers: %p`,
    value => {
      // Assert
      expect(isSerializedControl(value)).toBe(true)
    },
  )

  test.each([
    serializeControl(Checkbox({ label: 'Checkbox', defaultValue: true })),
    serializeControl(Number({ label: 'Number', defaultValue: 42 })),
    serializeControl(Select({ label: 'Select', options: [{ value: 'red', label: 'Red' }] })),
  ])(`returns true for serialized controls: %p`, value => {
    // Assert
    expect(isSerializedControl(value)).toBe(true)
  })

  test.each(['string', 1, true, null, undefined, { key: 'value' }, [{ key: 'value' }]])(
    'returns false for invalid serialized data: %p',
    value => {
      // Assert
      expect(isSerializedControl(value)).toBe(false)
    },
  )
})

const messagePortToNoopAsyncFunction: DeserializationPlugin<unknown, (...args: unknown[]) => Promise<unknown>> = {
  match: (value: unknown) =>
    typeof value === 'object' && value !== null && (value as { __serializedType?: string }).__serializedType === 'MessagePort',
  deserialize: () => async (): Promise<undefined> => undefined,
}

describe('deserializeControl with plugins (legacy List and Typeahead)', () => {
  test('legacy flow for List prop control: when plugin transforms getItemLabel from MessagePort placeholder to function, deserialized getItemLabel is used as-is and is callable', () => {
    const serializedList = {
      type: DELETED_PROP_CONTROLLER_TYPES.List,
      options: {
        type: { type: 'Checkbox', options: { label: 'Item', defaultValue: false } },
        getItemLabel: { __serializedType: 'MessagePort' },
      },
    }

    const deserialized = deserializeControl(serializedList as unknown as SerializedListControl<ListValue>, {
      plugins: [messagePortToNoopAsyncFunction],
    }) as { type: string; options: { getItemLabel?: (...args: unknown[]) => Promise<unknown> } }

    expect(deserialized.type).toBe(DELETED_PROP_CONTROLLER_TYPES.List)
    expect(typeof deserialized.options.getItemLabel).toBe('function')
    return expect(deserialized.options.getItemLabel!()).resolves.toBeUndefined()
  })

  test('legacy flow for Typeahead prop control: when plugin transforms getItems from MessagePort placeholder to function, deserialized getItems is used as-is and is callable', () => {
    const serializedTypeahead = {
      type: DELETED_PROP_CONTROLLER_TYPES.Typeahead,
      options: {
        getItems: { __serializedType: 'MessagePort' },
      },
    }

    const deserialized = deserializeControl(serializedTypeahead as unknown as SerializedTypeaheadControl<TypeaheadValue>, {
      plugins: [messagePortToNoopAsyncFunction],
    }) as { type: string; options: { getItems?: (query: string) => Promise<unknown> } }

    expect(deserialized.type).toBe(DELETED_PROP_CONTROLLER_TYPES.Typeahead)
    expect(typeof deserialized.options.getItems).toBe('function')
    return expect(deserialized.options.getItems!('')).resolves.toBeUndefined()
  })
})
