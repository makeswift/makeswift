import { P, match } from 'ts-pattern'
import { type CopyContext, type ImageControlData } from '@makeswift/controls'

export function copyImageData(
  value: ImageControlData | undefined,
  context: CopyContext,
): ImageControlData | undefined {
  if (value == null) return value

  return match(value)
    .with(P.string, id => context.replacementContext.fileIds.get(id) ?? id)
    .with({ type: 'makeswift-file' }, ({ id }) => context.replacementContext.fileIds.get(id) ?? id)
    .otherwise(val => val)
}
