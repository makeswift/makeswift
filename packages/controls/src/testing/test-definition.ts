import { ControlDataTypeKey } from '../common/types'
import { type ValueType } from '../controls/associated-types'
import { ControlDefinition } from '../controls/definition'

function toV0<Def extends ControlDefinition>(definition: Def) {
  const DefinitionClass = definition.constructor as any
  return DefinitionClass.deserialize({
    type: DefinitionClass.type,
    config: definition.config,
  })
}

export function testDefinition<Def extends ControlDefinition>(
  definition: Def,
  values: readonly ValueType<Def>[],
  invalidValues: readonly unknown[],
) {
  describe(`definition w/ config ${JSON.stringify(definition.config)}`, () => {
    describe('safeParse', () => {
      describe('v0', () => {
        test.each(values)('parses `%s`', (value) => {
          expect(definition.safeParse(value)).toEqual({
            success: true,
            data: value,
          })
        })

        test('parses `undefined`', () => {
          expect(definition.safeParse(undefined)).toEqual({
            success: true,
            data: undefined,
          })
        })

        test.each(invalidValues)(
          'refuses to parse `%s` as invalid input',
          (value) => {
            expect(definition.safeParse(value)).toEqual({
              success: false,
              error: expect.any(String),
            })
          },
        )
      })

      describe('v1', () => {
        test.each(values)('parses `%s`', (value) => {
          // Arrange
          const data = definition.toData(value)

          // Assert
          expect(definition.safeParse(data)).toEqual({
            success: true,
            data,
          })
        })

        test('parses `undefined`', () => {
          expect(definition.safeParse(undefined)).toEqual({
            success: true,
            data: undefined,
          })
        })

        test.each(invalidValues)(
          'refuses to parse correctly versioned invalid value `%s`',
          (value) => {
            // Arrange
            const data = definition.toData(value as any)

            // Assert
            expect(definition.safeParse(data)).toEqual({
              success: false,
              error: expect.any(String),
            })
          },
        )

        test.each(values)(
          'refuses to parse incorrectly versioned value `%s`',
          (value) => {
            expect(definition.safeParse({ value })).toEqual({
              success: false,
              error: expect.any(String),
            })

            expect(
              definition.safeParse({
                [ControlDataTypeKey]: 'invalid key',
                value,
              }),
            ).toEqual({
              success: false,
              error: expect.any(String),
            })
          },
        )
      })
    })

    describe('fromData', () => {
      test.each(values)('v1 `%s`', (value) => {
        // Arrange
        const data = definition.toData(value)

        // Act
        const result = definition.fromData(data)

        // Assert
        expect(result).toEqual(value)
      })

      test.each(values)('v0 `%s`', (value) => {
        // Arrange
        const data = value

        // Act
        const result = definition.fromData(data)

        // Assert
        expect(result).toEqual(value)
      })
    })

    describe('toData', () => {
      test.each(values)(
        'returns v1 data for `%s` when definition version is 1',
        (value) => {
          expect(definition.toData(value)).toMatchSnapshot()
        },
      )

      test.each(values)(
        'returns v0 value for `%s` when definition is unversioned',
        (value) => {
          // Arrange
          const v0Definition = toV0(definition)

          // Act
          const result = v0Definition.toData(value as any)

          // Assert
          expect(v0Definition.version).toBe(undefined)
          expect(result).toBe(value)
        },
      )
    })
  })
}

export function testResolveValue<Def extends ControlDefinition>(
  definition: Def,
  values: readonly ValueType<Def>[],
) {
  describe(`resolveValue w/ config ${JSON.stringify(definition.config)}`, () => {
    test.each(values)('resolves data (%s)', (value) => {
      const data = definition.toData(value)
      const resolvedValue = definition.resolveValue(data).readStableValue()
      // for all basic controls, if the resolved value is a primitive, it should equal to the original value;
      // we assert this explicitly rather than matching against a snapshot to avoid generating a lot of
      // trivial snapshots, which would be harder to parse/verify
      if (typeof value !== 'object') {
        expect(resolvedValue).toBe(value)
      } else {
        expect(resolvedValue).toMatchSnapshot()
      }
    })

    if ('version' in definition) {
      test.each(values)('resolves unversioned data (%s)', (value) => {
        const v0Definition = toV0(definition)
        const data = v0Definition.toData(value as any)
        const resolvedValue = definition.resolveValue(data).readStableValue()
        if (typeof value !== 'object') {
          expect(resolvedValue).toBe(value)
        } else {
          expect(resolvedValue).toMatchSnapshot()
        }
      })
    }

    describe('resolves undefined data', () => {
      const defaultValue = (definition.config as any).defaultValue
      test(`resolves to ${defaultValue !== undefined ? 'default value when default' : 'undefined when no default value '} is provided`, () => {
        expect(definition.resolveValue(undefined).readStableValue()).toBe(
          defaultValue,
        )
      })
    })
  })
}
