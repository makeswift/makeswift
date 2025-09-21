import { MergeTranslationsVisitor } from '../controls'

export class TestMergeTranslationsVisitor extends MergeTranslationsVisitor {
  visitRichTextV2() {
    console.error(
      '`visitRichTextV2` not implemented for TestMergeTranslationsVisitor',
    )
    return null
  }
}
