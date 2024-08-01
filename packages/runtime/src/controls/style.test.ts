import {
  Style,
  StyleDefinition,
  type DataType,
  createReplacementContext,
  Targets,
} from '@makeswift/controls'

describe('Style', () => {
  describe('style copy', () => {
    test('colors are replaced', () => {
      // Arrange'
      const swatchId = 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA=='
      const value: DataType<StyleDefinition> = {
        width: [
          {
            value: {
              unit: 'px',
              value: 100,
            },
            deviceId: 'desktop',
          },
        ],
        border: [
          {
            value: {
              borderTop: {
                color: {
                  alpha: 1,
                  swatchId,
                },
                style: 'solid',
                width: 9,
              },
              borderLeft: {
                color: {
                  alpha: 1,
                  swatchId,
                },
                style: 'solid',
                width: 9,
              },
              borderRight: {
                color: {
                  alpha: 1,
                  swatchId,
                },
                style: 'solid',
                width: 9,
              },
              borderBottom: {
                color: {
                  alpha: 1,
                  swatchId,
                },
                style: 'solid',
                width: 9,
              },
            },
            deviceId: 'desktop',
          },
        ],
        textStyle: [
          {
            value: {
              fontSize: {
                unit: 'px',
                value: 46,
              },
              fontStyle: [],
              fontFamily: 'Oswald',
              fontWeight: 400,
              letterSpacing: 5.2,
              textTransform: [],
            },
            deviceId: 'desktop',
          },
        ],
        borderRadius: [
          {
            value: {
              borderTopLeftRadius: {
                unit: 'px',
                value: 4,
              },
              borderTopRightRadius: {
                unit: 'px',
                value: 4,
              },
              borderBottomLeftRadius: {
                unit: 'px',
                value: 4,
              },
              borderBottomRightRadius: {
                unit: 'px',
                value: 4,
              },
            },
            deviceId: 'desktop',
          },
        ],
      }

      const expected = JSON.parse(JSON.stringify(value).replaceAll(swatchId, 'testing'))

      // Act
      const result = Style().copyData(value, {
        replacementContext: createReplacementContext({
          swatchIds: {
            [swatchId]: 'testing',
          },
        }),
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })

  describe('style introspection', () => {
    test('swatchIds are found', () => {
      // Arrange'
      const value: DataType<StyleDefinition> = {
        width: [
          {
            value: {
              unit: 'px',
              value: 100,
            },
            deviceId: 'desktop',
          },
        ],
        border: [
          {
            value: {
              borderTop: {
                color: {
                  alpha: 1,
                  swatchId: 'swatch-id-1',
                },
                style: 'solid',
                width: 9,
              },
              borderLeft: {
                color: {
                  alpha: 1,
                  swatchId: 'swatch-id-2',
                },
                style: 'solid',
                width: 9,
              },
              borderRight: {
                color: {
                  alpha: 1,
                  swatchId: 'swatch-id-3',
                },
                style: 'solid',
                width: 9,
              },
              borderBottom: {
                color: {
                  alpha: 1,
                  swatchId: 'swatch-id-4',
                },
                style: 'solid',
                width: 9,
              },
            },
            deviceId: 'desktop',
          },
        ],
        textStyle: [
          {
            value: {
              fontSize: {
                unit: 'px',
                value: 46,
              },
              fontStyle: [],
              fontFamily: 'Oswald',
              fontWeight: 400,
              letterSpacing: 5.2,
              textTransform: [],
            },
            deviceId: 'desktop',
          },
        ],
        borderRadius: [
          {
            value: {
              borderTopLeftRadius: {
                unit: 'px',
                value: 4,
              },
              borderTopRightRadius: {
                unit: 'px',
                value: 4,
              },
              borderBottomLeftRadius: {
                unit: 'px',
                value: 4,
              },
              borderBottomRightRadius: {
                unit: 'px',
                value: 4,
              },
            },
            deviceId: 'desktop',
          },
        ],
      }

      // Act
      const swatchIds = Style().introspect(value, Targets.Swatch)
      // Assert
      expect(new Set(swatchIds)).toEqual(
        new Set(['swatch-id-1', 'swatch-id-2', 'swatch-id-3', 'swatch-id-4']),
      )
    })
  })
})
