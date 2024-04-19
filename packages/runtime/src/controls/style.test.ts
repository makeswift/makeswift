import { StyleControlData, copyStyleData } from './style'
import { ReplacementContext } from '../state/react-page'

describe('style copy', () => {
  test('colors are replaced', () => {
    // Arrange
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
                swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
              },
              style: 'solid',
              width: 9,
            },
            borderLeft: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
              },
              style: 'solid',
              width: 9,
            },
            borderRight: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
              },
              style: 'solid',
              width: 9,
            },
            borderBottom: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
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
    const expected = JSON.parse(
      JSON.stringify(value).replaceAll(
        'U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==',
        'testing',
      ),
    )

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map(),
      swatchIds: new Map([
        ['U3dhdGNoOmJjMDkwZWJjLTZkZDUtNDY1NS1hMDY0LTg3ZDAxM2U4YTFhNA==', 'testing'],
      ]),
      fileIds: new Map(),
      typographyIds: new Map(),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      pageIds: new Map(),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    // Act
    const result = copyStyleData(value, {
      replacementContext: replacementContext as ReplacementContext,
      copyElement: node => node,
    })

    // Assert
    expect(result).toMatchObject(expected)
  })
})
