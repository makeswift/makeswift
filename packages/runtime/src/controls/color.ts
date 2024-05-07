import { match } from 'ts-pattern'
import { ColorControlData, ColorControlDataTypeKey, ColorControlDataTypeValueV1 } from '@makeswift/controls'

import type { CopyContext } from '../state/react-page'


// @todo: move this into controls package
export function copyColorData(
  value: ColorControlData | undefined,
  context: CopyContext,
): ColorControlData | undefined {
  if (value == null) return value

  return match(value)
    .with({ [ColorControlDataTypeKey]: ColorControlDataTypeValueV1 }, val => ({
      ...val,
      swatchId: context.replacementContext.swatchIds.get(val.swatchId) ?? val.swatchId,
    }))
    .otherwise(val => ({
      ...val,
      swatchId: context.replacementContext.swatchIds.get(val.swatchId) ?? val.swatchId,
    }))
}
