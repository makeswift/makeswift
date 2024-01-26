import { CopyContext } from '../../state/react-page'
import { ImageDescriptor, ImageValue } from '../descriptors'
import { match, P } from 'ts-pattern'

export function copy(
  descriptor: ImageDescriptor,
  value: ImageValue | undefined,
  context: Pick<CopyContext, 'replacementContext'>,
): ImageValue | undefined {
  return match([descriptor, value])
    .with([P.any, P.string], ([, v]) => context.replacementContext.fileIds.get(v) ?? v)
    .with(
      [{ version: 1 }, { type: 'makeswift-file', version: 1 }],
      ([, v]) => context.replacementContext.fileIds.get(v.id) ?? v.id,
    )
    .otherwise(([, v]) => v)
}
