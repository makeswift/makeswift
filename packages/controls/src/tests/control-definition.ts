import { ControlDataTypeKey } from '../common/types'

import {
  type ValueType,
  type DataType,
  ControlDefinition,
} from '../control-definition'

export function testDefinition<Def extends ControlDefinition>(
  definition: Def,
  values: ValueType<Def>[],
  invalidValues: unknown[],
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
        const data: DataType<typeof definition> = definition.toData(value)

        // Act
        const result = definition.fromData(data)

        // Assert
        expect(result).toEqual(value)
      })

      test.each(values)('v0 `%s`', (value) => {
        // Arrange
        const data = value satisfies DataType<typeof definition>

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
          const DefinitionClass = definition.constructor as any
          const v0Definition = DefinitionClass.deserialize({
            type: DefinitionClass.type,
            config: definition.config,
          })

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
