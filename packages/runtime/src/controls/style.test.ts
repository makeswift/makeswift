import { StyleControlData, copyStyleData } from './style'
import { createReplacementContext } from '@makeswift/controls'

describe('style copy', () => {
  test('colors are replaced', () => {
    // Arrange'
    const swatchId = 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA=='
    const value: StyleControlData = {
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
    const result = copyStyleData(value, {
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
