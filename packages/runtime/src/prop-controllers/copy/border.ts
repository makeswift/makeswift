import { CopyContext } from '../../state/react-page'
import { BorderValue, getBorderValue } from '../descriptors'

export function copy(
  borderValue: BorderValue | undefined,
  context: CopyContext,
): BorderValue | undefined {
  const value = getBorderValue(borderValue)

  if (value == null) return undefined

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
