import { CopyContext, ReplacementContext } from '../../state/react-page'
import { BorderValue, TableValue } from '../descriptors'

export function copy(
  value: BorderValue | undefined,
  context: CopyContext,
): BorderValue | undefined {
  if (value == null) return value

  return value.map(override => ({ ...override, value: copyBorderValue(override.value) }))

  function copyBorderValue({ borderTop, borderRight, borderBottom, borderLeft }: any): any {
    return {
      borderTop: borderTop && copyBorderSide(borderTop),
      borderRight: borderRight && copyBorderSide(borderRight),
      borderBottom: borderBottom && copyBorderSide(borderBottom),
      borderLeft: borderLeft && copyBorderSide(borderLeft),
    }
  }

  function copyBorderSide(borderSide: any): any {
    const { color } = borderSide

    if (color == null) return borderSide

    return {
      ...borderSide,
      color: {
        ...color,
        swatchId: context.replacementContext.swatchIds.get(color.swatchId) ?? color.swatchId,
      },
    }
  }
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest
  describe.concurrent('border copy', () => {
    test('replaces the swatch id', () => {
      // Arrange
      const data: BorderValue = [
        {
          value: {
            borderTop: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
              },
              style: 'solid',
              width: 5,
            },
            borderLeft: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
              },
              style: 'solid',
              width: 5,
            },
            borderRight: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
              },
              style: 'solid',
              width: 5,
            },
            borderBottom: {
              color: {
                alpha: 1,
                swatchId: 'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==',
              },
              style: 'solid',
              width: 5,
            },
          },
          deviceId: 'desktop',
        },
      ]
      const expected: BorderValue = [
        {
          value: {
            borderTop: {
              color: {
                alpha: 1,
                swatchId: 'testing',
              },
              style: 'solid',
              width: 5,
            },
            borderLeft: {
              color: {
                alpha: 1,
                swatchId: 'testing',
              },
              style: 'solid',
              width: 5,
            },
            borderRight: {
              color: {
                alpha: 1,
                swatchId: 'testing',
              },
              style: 'solid',
              width: 5,
            },
            borderBottom: {
              color: {
                alpha: 1,
                swatchId: 'testing',
              },
              style: 'solid',
              width: 5,
            },
          },
          deviceId: 'desktop',
        },
      ]
      const replacementContext = {
        elementHtmlIds: new Set(),
        elementKeys: new Map(),
        swatchIds: new Map([
          ['U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg==', 'testing'],
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
      const result = copy(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
