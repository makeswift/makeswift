import {
  AcceptedNumberDataTypes,
  AcceptedTextDataTypes,
  Code,
  ControlDataTypeKey,
  Number as ModernNumber,
  NumberDataTypes,
  TextArea as ModernTextArea,
  TextDataTypes,
  TextInput as ModernTextInput,
} from '@makeswift/controls'

import {
  getNumberPropControllerDataNumber,
  numberPropControllerDataSchema,
} from '../number'
import {
  TextAreaPropControllerData,
  getTextAreaPropControllerDataString,
  textAreaPropControllerDataSchema,
} from '../text-area/text-area'
import {
  TextInputPropControllerData,
  getTextInputPropControllerDataString,
  textInputPropControllerDataSchema,
} from '../text-input/text-input'

describe('@makeswift/controls -> @makeswift/prop-controllers interop', () => {
  describe('text group', () => {
    const modernTextWriters = {
      TextInput: ModernTextInput(),
      TextArea: ModernTextArea(),
      Code: Code(),
    } as const

    describe.each(Object.entries(modernTextWriters))(
      'data written by modern controls %s',
      (writerName, writer) => {
        const value = `hello from ${writerName}`
        const written = writer.toData(value)

        test(`textInputPropControllerDataSchema parses it`, () => {
          expect(
            textInputPropControllerDataSchema.safeParse(written).success,
          ).toBe(true)
        })

        test(`textAreaPropControllerDataSchema parses it`, () => {
          expect(
            textAreaPropControllerDataSchema.safeParse(written).success,
          ).toBe(true)
        })

        test(`getTextInputPropControllerDataString returns the inner value`, () => {
          expect(
            getTextInputPropControllerDataString(
              written as TextInputPropControllerData,
            ),
          ).toBe(value)
        })

        test(`getTextAreaPropControllerDataString returns the inner value`, () => {
          expect(
            getTextAreaPropControllerDataString(
              written as TextAreaPropControllerData,
            ),
          ).toBe(value)
        })
      },
    )

    describe('backward compatibility: every accepted modern text marker is parsable', () => {
      describe.each(AcceptedTextDataTypes)('marker %s', (marker) => {
        const data = {
          [ControlDataTypeKey]: marker,
          value: 'legacy value',
        }

        test('textInputPropControllerDataSchema parses', () => {
          expect(
            textInputPropControllerDataSchema.safeParse(data).success,
          ).toBe(true)
        })

        test('textAreaPropControllerDataSchema parses', () => {
          expect(textAreaPropControllerDataSchema.safeParse(data).success).toBe(
            true,
          )
        })

        test('getTextInputPropControllerDataString returns the inner value', () => {
          expect(
            getTextInputPropControllerDataString(
              data as TextInputPropControllerData,
            ),
          ).toBe('legacy value')
        })

        test('getTextAreaPropControllerDataString returns the inner value', () => {
          expect(
            getTextAreaPropControllerDataString(
              data as TextAreaPropControllerData,
            ),
          ).toBe('legacy value')
        })
      })
    })

    test('override-then-revert round-trip preserves text value', () => {
      // 1. Built-in (prop-controllers) writes legacy v1 data
      const persisted = {
        [ControlDataTypeKey]: 'prop-controllers::text-input::v1' as const,
        value: 'Shop now',
      }

      // 2. Host overrides with custom component using modern controls; on next
      //    edit, modern toData rewrites the marker to its own legacy marker
      //    'text-input::v1'.
      const afterModernRead = ModernTextInput().fromData(persisted as never)
      const afterModernEdit = ModernTextInput().toData(afterModernRead!)

      expect(afterModernEdit).toEqual({
        [ControlDataTypeKey]: TextDataTypes.textInput,
        value: 'Shop now',
      })

      // 3. Host removes the override; built-in must still read the value.
      expect(
        getTextInputPropControllerDataString(
          afterModernEdit as TextInputPropControllerData,
        ),
      ).toBe('Shop now')
    })
  })

  describe('number group', () => {
    const writer = ModernNumber()
    const value = 42
    const written = writer.toData(value)

    test('numberPropControllerDataSchema parses modern-written data', () => {
      expect(numberPropControllerDataSchema.safeParse(written).success).toBe(
        true,
      )
    })

    test('getNumberPropControllerDataNumber returns the inner value', () => {
      expect(getNumberPropControllerDataNumber(written as never)).toBe(value)
    })

    describe('backward compatibility: every accepted modern number marker is parsable', () => {
      describe.each(AcceptedNumberDataTypes)('marker %s', (marker) => {
        const data = { [ControlDataTypeKey]: marker, value: 7 }

        test('numberPropControllerDataSchema parses', () => {
          expect(numberPropControllerDataSchema.safeParse(data).success).toBe(
            true,
          )
        })

        test('getNumberPropControllerDataNumber returns the inner value', () => {
          expect(getNumberPropControllerDataNumber(data as never)).toBe(7)
        })
      })
    })

    test('override-then-revert round-trip preserves number value', () => {
      const persisted = {
        [ControlDataTypeKey]: 'prop-controllers::number::v1' as const,
        value: 99,
      }

      const afterModernRead = ModernNumber().fromData(persisted as never)
      const afterModernEdit = ModernNumber().toData(afterModernRead!)

      expect(afterModernEdit).toEqual({
        [ControlDataTypeKey]: NumberDataTypes.number,
        value: 99,
      })

      expect(getNumberPropControllerDataNumber(afterModernEdit as never)).toBe(
        99,
      )
    })
  })

  describe('cross-group rejection', () => {
    test('a text marker does not parse under numberPropControllerDataSchema', () => {
      const data = { [ControlDataTypeKey]: 'text', value: 'hi' }
      expect(numberPropControllerDataSchema.safeParse(data).success).toBe(false)
    })

    test('a number marker does not parse under text schemas', () => {
      const data = { [ControlDataTypeKey]: 'number', value: 42 }
      expect(textInputPropControllerDataSchema.safeParse(data).success).toBe(
        false,
      )
      expect(textAreaPropControllerDataSchema.safeParse(data).success).toBe(
        false,
      )
    })
  })
})
