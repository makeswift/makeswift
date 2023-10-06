import { describe, expect, test } from 'vitest'
import { mergeRichTextV2TranslatedData } from '../translation'
import { RichText } from '../rich-text-v2'
import * as Simple from './fixtures/simple'
import * as SubSupCode from './fixtures/rearranged'

describe('GIVEN merging translations for RichTextV2', () => {
  test('WHEN merging simple strings THEN correct string is returned', () => {
    const result = mergeRichTextV2TranslatedData(
      RichText(),
      Simple.sourceElementTree,
      Simple.translatedData,
    )

    expect(result).toEqual(Simple.targetElementTree)
  })

  test('WHEN merging rearranged strings THEN correct string is returned', () => {
    const result = mergeRichTextV2TranslatedData(
      RichText(),
      SubSupCode.sourceElementTree,
      SubSupCode.translatedData,
    )

    expect(result).toEqual(SubSupCode.targetElementTree)
  })
})
