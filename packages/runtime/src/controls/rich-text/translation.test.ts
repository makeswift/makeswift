import { describe, expect, test } from 'vitest'
import { blockquoteFixture, listFixture, typographyFixture } from './fixtures'
import { richTextDAOToDTO, richTextDTOtoDAO, richTextDTOtoSelection } from './translation'
import { RichTextDTO } from './dto-types'
import { emptyBlockFixture, fixedEmptyBlockFixture } from './fixtures/empty-blocks'

describe('GIVEN I am using RichText data translation', () => {
  test('WHEN I translate simple data THEN nothing is lost', () => {
    const value: RichTextDTO = {
      document: {
        object: 'document',
        data: undefined,
        nodes: [],
      },
      annotations: undefined,
      data: undefined,
      object: 'value',
      selection: undefined,
    }

    expect(value).toStrictEqual(
      richTextDAOToDTO(richTextDTOtoDAO(value), richTextDTOtoSelection(value)),
    )
  })
  test('WHEN I translate list data THEN nothing is lost', () => {
    expect(listFixture).toStrictEqual(
      richTextDAOToDTO(richTextDTOtoDAO(listFixture), richTextDTOtoSelection(listFixture)),
    )
  })
  test('WHEN I translate typography data THEN nothing is lost', () => {
    expect(typographyFixture).toStrictEqual(
      richTextDAOToDTO(
        richTextDTOtoDAO(typographyFixture),
        richTextDTOtoSelection(typographyFixture),
      ),
    )
  })
  test('WHEN I translate blockquote data THEN nothing is lost', () => {
    expect(blockquoteFixture).toStrictEqual(
      richTextDAOToDTO(
        richTextDTOtoDAO(blockquoteFixture),
        richTextDTOtoSelection(blockquoteFixture),
      ),
    )
  })
  test('WHEN translate data with empty blocks THEN empty blocks are removed', () => {
    expect(fixedEmptyBlockFixture).toStrictEqual(
      richTextDAOToDTO(
        richTextDTOtoDAO(emptyBlockFixture),
        richTextDTOtoSelection(emptyBlockFixture),
      ),
    )
  })
})
