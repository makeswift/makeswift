import { serializeControls, deserializeControls } from './control-serialization'
import { Checkbox, Number, Select } from '@makeswift/controls'

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
      // @ts-expect-error Invalid config for number
      faultyNumber: Number({ label: 'Number', defaultValue: 'not a number!' }),
      // @ts-expect-error Invalid config for select
      faultySelect: Select({ label: 'Select', options: [{ value: 1, label: 'Red' }] }),
    } as const

    const [serialized, transferables] = serializeControls(controls)

    // Act
    const errorCallback = jest.fn()
    const deserializedControls = deserializeControls(serialized, {
      onError: errorCallback,
    })

    // Assert
    expect(Object.keys(deserializedControls)).toEqual(['checkbox'])
    expect(errorCallback).toHaveBeenCalledTimes(2)

    transferables.forEach((port: any) => port.close())
  })
})
