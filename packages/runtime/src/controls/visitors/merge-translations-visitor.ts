import { Data, DataType, MergeTranslationsVisitor } from '@makeswift/controls'

import { RichTextV2Definition } from '../rich-text-v2'
import { RichTextTranslationDto } from '../rich-text-v2/translations/translations-core'
import { mergeTranslatedNodes } from '../rich-text-v2/translations/merge-translations'

export class ReactMergeTranslationsVisitor extends MergeTranslationsVisitor {
  visitRichTextV2(
    def: RichTextV2Definition,
    data: DataType<RichTextV2Definition> | undefined,
    translatedData: Data,
  ): Data {
    if (data == null || translatedData == null) return data

    const { descendants, ...rest } = RichTextV2Definition.normalizeData(data)

    return {
      ...rest,
      descendants: mergeTranslatedNodes(
        descendants,
        translatedData as RichTextTranslationDto,
        def.config.plugins,
      ),
    }
  }
}
