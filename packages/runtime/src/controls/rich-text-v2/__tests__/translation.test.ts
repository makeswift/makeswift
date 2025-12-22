import { type MergeTranslatableDataContext } from '@makeswift/controls'
import { RichText } from '../rich-text-v2'

import * as Simple from './fixtures/simple'
import * as SubSupCode from './fixtures/rearranged'
import * as NestedParagraphEdgeCase from './fixtures/nested-paragraph-edge-case-3728'
import { ReactMergeTranslationsVisitor } from '../../visitors/merge-translations-visitor'

describe('GIVEN merging translations for RichTextV2', () => {
  const mergeContext: MergeTranslatableDataContext = {
    translatedData: {},
    mergeTranslatedData: element => element,
  }

  const visitor = new ReactMergeTranslationsVisitor(mergeContext)

  test('WHEN merging simple strings THEN correct string is returned', () => {
    const result = RichText().accept(visitor, Simple.sourceElementTree, Simple.translatedData)

    expect(result).toEqual(Simple.targetElementTree)
  })

  test('WHEN merging rearranged strings THEN correct string is returned', () => {
    const result = RichText().accept(
      visitor,
      SubSupCode.sourceElementTree,
      SubSupCode.translatedData,
    )

    expect(result).toEqual(SubSupCode.targetElementTree)
  })
})

describe('GIVEN retrieving translatable data for RichTextV2', () => {
  test('WHEN getting translatable data with nested paragraph elements THEN paragraphs are unwrapped correctly', () => {
    const result = RichText().getTranslatableData(NestedParagraphEdgeCase.sourceElementTree)

    expect(result).toEqual(NestedParagraphEdgeCase.translatableData)
  })
})
