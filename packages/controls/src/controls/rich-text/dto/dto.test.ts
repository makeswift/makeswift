import * as Fixtures from '../__fixtures__'

import {
  richTextDAOToDTO,
  richTextDTOtoDAO,
  richTextDTOtoSelection,
  type RichTextDTO,
} from './dto'

describe('GIVEN RichText DTO translation', () => {
  test.each([
    [
      'simple data',
      {
        document: {
          object: 'document',
          data: undefined,
          nodes: [],
        },
        annotations: undefined,
        data: undefined,
        object: 'value',
        selection: undefined,
      } satisfies RichTextDTO,
    ],
    ['blockquote', Fixtures.blockquote],
    ['empty blocks', Fixtures.fixedEmptyBlocks],
    ['list', Fixtures.list],
    ['typography', Fixtures.typography],
    ['v2 blocks', Fixtures.v2Blocks],
  ])('WHEN translating %s data THEN nothing is lost', (_, data) => {
    expect(data).toStrictEqual(
      richTextDAOToDTO(richTextDTOtoDAO(data), richTextDTOtoSelection(data)),
    )
  })
})
