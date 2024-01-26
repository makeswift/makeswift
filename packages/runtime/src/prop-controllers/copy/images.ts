import { match, P } from 'ts-pattern'
import { CopyContext } from '../../state/react-page'
import { ImagesDescriptor, ImagesValue, ImagesValueItem } from '../descriptors'

export function copy(
  descriptor: ImagesDescriptor,
  value: ImagesValue | undefined,
  context: Pick<CopyContext, 'replacementContext'>,
): ImagesValue | undefined {
  if (value == null) return value

  return value.map(copyImagesPanelItem)

  function copyImagesPanelItem(imagesPanelItem: ImagesValueItem): any {
    const { file } = imagesPanelItem.props

    if (file == null) return imagesPanelItem

    return {
      ...imagesPanelItem,
      props: {
        ...imagesPanelItem.props,
        file: match([descriptor, file])
          .with([P.any, P.string], ([, f]) => context.replacementContext.fileIds.get(f) ?? f)
          .with(
            [{ version: 1 }, { type: 'makeswift-file', version: 1 }],
            ([, f]) => context.replacementContext.fileIds.get(f.id) ?? f.id,
          )
          .otherwise(([, f]) => f),
      },
    }
  }
}
