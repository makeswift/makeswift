import { CopyContext } from '../../state/react-page'
import { BorderValue } from '../descriptors'

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
