import {
  AcceptedNumberDataTypes,
  AcceptedTextDataTypes,
  ControlDataTypeKey,
} from '../../common'

import { Code, CodeDefinition } from '../code'
import { Number, NumberDefinition } from '../number'
import { TextArea, TextAreaDefinition } from '../text-area'
import { TextInput, TextInputDefinition } from '../text-input'

const textControls = {
  TextInput: TextInput(),
  TextArea: TextArea(),
  Code: Code(),
} as const

const numberControls = {
  Number: Number(),
} as const

describe('cross-control interop', () => {
  describe('text group', () => {
    describe.each(Object.entries(textControls))(
      'data written by %s',
      (writerName, writer) => {
        const value = `hello from ${writerName}`
        const written = writer.toData(value)

        describe('writes the shared text marker', () => {
          test('toData uses the shared "text" marker', () => {
            expect(written).toEqual({
              [ControlDataTypeKey]: 'text',
              value,
            })
          })
        })

        describe.each(Object.entries(textControls))(
          'parses under %s',
          (readerName, reader) => {
            test(`${readerName}.safeParse succeeds`, () => {
              expect(reader.safeParse(written).success).toBe(true)
            })

            test(`${readerName}.fromData returns the inner value`, () => {
              expect(reader.fromData(written)).toBe(value)
            })
          },
        )
      },
    )

    describe('backward compatibility: every accepted text marker is parsable by every text control', () => {
      describe.each(AcceptedTextDataTypes)('marker %s', (marker) => {
        const legacyData = {
          [ControlDataTypeKey]: marker,
          value: 'legacy value',
        }

        describe.each(Object.entries(textControls))('%s', (_name, control) => {
          test('safeParse succeeds', () => {
            expect(control.safeParse(legacyData).success).toBe(true)
          })

          test('fromData returns the inner value', () => {
            expect(control.fromData(legacyData as never)).toBe('legacy value')
          })
        })
      })
    })

    describe('raw string (pre-versioned) shape is still parsable', () => {
      describe.each(Object.entries(textControls))('%s', (_name, control) => {
        test('safeParse succeeds on raw string', () => {
          expect(control.safeParse('plain').success).toBe(true)
        })

        test('fromData returns the raw string', () => {
          expect(control.fromData('plain' as never)).toBe('plain')
        })
      })
    })
  })

  describe('number group', () => {
    describe.each(Object.entries(numberControls))(
      'data written by %s',
      (_writerName, writer) => {
        const value = 42
        const written = writer.toData(value)

        describe('writes the shared number marker', () => {
          test('toData uses the shared "number" marker', () => {
            expect(written).toEqual({
              [ControlDataTypeKey]: 'number',
              value,
            })
          })
        })

        describe.each(Object.entries(numberControls))(
          'parses under %s',
          (readerName, reader) => {
            test(`${readerName}.safeParse succeeds`, () => {
              expect(reader.safeParse(written).success).toBe(true)
            })

            test(`${readerName}.fromData returns the inner value`, () => {
              expect(reader.fromData(written)).toBe(value)
            })
          },
        )
      },
    )

    describe('backward compatibility: every accepted number marker is parsable by every number control', () => {
      describe.each(AcceptedNumberDataTypes)('marker %s', (marker) => {
        const legacyData = {
          [ControlDataTypeKey]: marker,
          value: 7,
        }

        describe.each(Object.entries(numberControls))(
          '%s',
          (_name, control) => {
            test('safeParse succeeds', () => {
              expect(control.safeParse(legacyData).success).toBe(true)
            })

            test('fromData returns the inner value', () => {
              expect(control.fromData(legacyData as never)).toBe(7)
            })
          },
        )
      })
    })

    describe('raw number (pre-versioned) shape is still parsable', () => {
      describe.each(Object.entries(numberControls))('%s', (_name, control) => {
        test('safeParse succeeds on raw number', () => {
          expect(control.safeParse(123).success).toBe(true)
        })

        test('fromData returns the raw number', () => {
          expect(control.fromData(123 as never)).toBe(123)
        })
      })
    })
  })

  describe('cross-group rejection', () => {
    test('a text-group marker does not parse under Number', () => {
      const textShape = { [ControlDataTypeKey]: 'text', value: 'hi' }
      expect(Number().safeParse(textShape).success).toBe(false)
    })

    test('the legacy "number::v1" marker does not parse under any text control', () => {
      const numberShape = { [ControlDataTypeKey]: 'number::v1', value: 42 }
      expect(TextInput().safeParse(numberShape).success).toBe(false)
      expect(TextArea().safeParse(numberShape).success).toBe(false)
      expect(Code().safeParse(numberShape).success).toBe(false)
    })

    test('a raw string does not parse under Number', () => {
      expect(Number().safeParse('hi').success).toBe(false)
    })

    test('a raw number does not parse under TextInput/TextArea/Code', () => {
      expect(TextInput().safeParse(42).success).toBe(false)
      expect(TextArea().safeParse(42).success).toBe(false)
      expect(Code().safeParse(42).success).toBe(false)
    })
  })

  describe('legacy @makeswift/prop-controllers upgrade path', () => {
    test('legacy text-input data parses under modern TextInput/TextArea/Code', () => {
      const legacy = {
        [ControlDataTypeKey]: 'prop-controllers::text-input::v1',
        value: 'persisted under legacy package',
      }

      expect(TextInput().fromData(legacy as never)).toBe(
        'persisted under legacy package',
      )
      expect(TextArea().fromData(legacy as never)).toBe(
        'persisted under legacy package',
      )
      expect(Code().fromData(legacy as never)).toBe(
        'persisted under legacy package',
      )
    })

    test('legacy text-area data parses under modern TextInput/TextArea/Code', () => {
      const legacy = {
        [ControlDataTypeKey]: 'prop-controllers::text-area::v1',
        value: 'persisted under legacy package',
      }

      expect(TextInput().fromData(legacy as never)).toBe(
        'persisted under legacy package',
      )
      expect(TextArea().fromData(legacy as never)).toBe(
        'persisted under legacy package',
      )
      expect(Code().fromData(legacy as never)).toBe(
        'persisted under legacy package',
      )
    })

    test('legacy number data parses under modern Number', () => {
      const legacy = {
        [ControlDataTypeKey]: 'prop-controllers::number::v1',
        value: 99,
      }

      expect(Number().fromData(legacy as never)).toBe(99)
    })

    test('next edit through a modern control rewrites the marker to the canonical text marker', () => {
      expect(TextInput().toData('after edit')).toEqual({
        [ControlDataTypeKey]: 'text',
        value: 'after edit',
      })
    })

    test('next edit through Number rewrites the marker to the canonical number marker', () => {
      expect(Number().toData(7)).toEqual({
        [ControlDataTypeKey]: 'number',
        value: 7,
      })
    })

    test('legacy text marker still does not parse under Number, and vice versa', () => {
      const legacyText = {
        [ControlDataTypeKey]: 'prop-controllers::text-input::v1',
        value: 'hi',
      }
      const legacyNumber = {
        [ControlDataTypeKey]: 'prop-controllers::number::v1',
        value: 7,
      }

      expect(Number().safeParse(legacyText).success).toBe(false)
      expect(TextInput().safeParse(legacyNumber).success).toBe(false)
      expect(TextArea().safeParse(legacyNumber).success).toBe(false)
      expect(Code().safeParse(legacyNumber).success).toBe(false)
    })
  })

  describe('type smoke test', () => {
    test('control factories yield the expected definition classes', () => {
      expect(TextInput()).toBeInstanceOf(TextInputDefinition)
      expect(TextArea()).toBeInstanceOf(TextAreaDefinition)
      expect(Code()).toBeInstanceOf(CodeDefinition)
      expect(Number()).toBeInstanceOf(NumberDefinition)
    })
  })
})
