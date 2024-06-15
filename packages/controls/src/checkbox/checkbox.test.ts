import {
  type ControlDefinitionType,
  type ControlDataType,
  type ValueType,
  ControlDataTypeKey,
} from '../common/types'

import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  describe('associated types', () => {
    test("definition's value type matches traits' `ValueType`", () => {
      // Arrange
      const value: boolean | undefined = true as ValueType<typeof Checkbox>

      // Assert
      value satisfies ValueType<ControlDefinitionType<typeof Checkbox>>
    })
  })

  describe('constructor', () => {
    test('function call returns definition', () => {
      // Act
      const result: ControlDefinitionType<typeof Checkbox> = Checkbox({
        label: 'visible',
        defaultValue: false,
      })

      // Assert
      expect(result).toEqual({
        config: {
          label: 'visible',
          defaultValue: false,
        },
        type: 'makeswift::controls::checkbox',
        version: 1,
      })
    })

    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      Checkbox({
        label: 'visible',
        defaultValue: false,
      }).config satisfies { label: string; defaultValue: boolean }

      Checkbox({
        label: 'visible',
      }).config satisfies { label: string }
    })

    test("refines value type based on ctor's `defaultValue`", () => {
      // Arrange
      const definition = Checkbox({
        label: 'visible',
        defaultValue: false,
      })

      // Assert
      const value: boolean = true as ValueType<typeof definition>
      expect(value).toBe(true)
    })
  })

  describe('safeParse', () => {
    test('v0', () => {
      // Assert
      expect(Checkbox.safeParse(true)).toEqual({ success: true, data: true })
      expect(Checkbox.safeParse(false)).toEqual({ success: true, data: false })
      expect(Checkbox.safeParse(undefined)).toEqual({
        success: true,
        data: undefined,
      })

      expect(Checkbox.safeParse(null)).toEqual({
        success: false,
        error: 'Invalid input',
      })

      expect(Checkbox.safeParse(1)).toEqual({
        success: false,
        error: 'Invalid input',
      })

      expect(Checkbox.safeParse('hi')).toEqual({
        success: false,
        error: 'Invalid input',
      })
    })

    test('v1', () => {
      // Arrange
      const truthy = Checkbox.toData(true, Checkbox({}))
      const falsy = Checkbox.toData(false, Checkbox({}))
      const invalid = Checkbox.toData('hi' as any, Checkbox({}))

      // Assert
      expect(Checkbox.safeParse(truthy)).toEqual({
        success: true,
        data: truthy,
      })

      expect(Checkbox.safeParse(falsy)).toEqual({ success: true, data: falsy })
      expect(Checkbox.safeParse(invalid)).toEqual({
        success: false,
        error: 'Invalid input',
      })

      expect(Checkbox.safeParse({ value: true })).toEqual({
        success: false,
        error: 'Invalid input',
      })

      expect(
        Checkbox.safeParse({
          [ControlDataTypeKey]: 'invalid key',
          value: true,
        }),
      ).toEqual({
        success: false,
        error: 'Invalid input',
      })
    })
  })

  describe('fromData', () => {
    test('v1', () => {
      // Arrange
      const data: ControlDataType<typeof Checkbox> = {
        ...Checkbox.dataSignature.v1,
        value: true,
      }

      // Act
      const result = Checkbox.fromData(data, Checkbox({}))

      // Assert
      expect(result).toEqual(data.value)
    })

    test('v0', () => {
      // Arrange
      const data = false satisfies ControlDataType<typeof Checkbox>

      // Act
      const result = Checkbox.fromData(data, Checkbox({}))

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('toData', () => {
    test('returns v1 data when definition version is 1', () => {
      // Arrange
      const definition = {
        type: Checkbox.controlType,
        version: 1,
        config: {},
      } satisfies ControlDefinitionType<typeof Checkbox>

      // Act
      const result = Checkbox.toData(false, definition)

      // Assert
      expect(result).toEqual({
        ...Checkbox.dataSignature.v1,
        value: false,
      })
    })

    test('returns v0 value when definition version is not 1', () => {
      // Arrange
      const definition = {
        type: Checkbox.controlType,
        config: {},
      } satisfies ControlDefinitionType<typeof Checkbox>

      // Act
      const result = Checkbox.toData(false, definition)

      // Assert
      expect(result).toBe(false)
    })
  })
})
