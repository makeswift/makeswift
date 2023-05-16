import { Editor, createEditor } from 'slate'
import { createHyperscript, createEditor as createHyperscriptEditor } from 'slate-hyperscript'
import { withReact } from 'slate-react'

import { withList, withTypography, withBlock, withInlineMode } from '..'
import { BlockType, InlineType } from '../../../types/slate'

export const createJsx = (editor: Editor) =>
  createHyperscript({
    elements: {
      [BlockType.Text]: { type: BlockType.Text },
      [BlockType.Paragraph]: { type: BlockType.Paragraph },

      [BlockType.Heading1]: { type: BlockType.Heading1 },
      [BlockType.Heading2]: { type: BlockType.Heading2 },
      [BlockType.Heading3]: { type: BlockType.Heading3 },
      [BlockType.Heading4]: { type: BlockType.Heading4 },
      [BlockType.Heading5]: { type: BlockType.Heading5 },
      [BlockType.Heading6]: { type: BlockType.Heading6 },

      [BlockType.BlockQuote]: { type: BlockType.BlockQuote },

      [BlockType.UnorderedList]: { type: BlockType.UnorderedList },
      [BlockType.OrderedList]: { type: BlockType.OrderedList },
      [BlockType.ListItem]: { type: BlockType.ListItem },
      [BlockType.ListItemChild]: { type: BlockType.ListItemChild },

      [InlineType.Code]: { type: InlineType.Code },
      [InlineType.SuperScript]: { type: InlineType.SuperScript },
      [InlineType.SubScript]: { type: InlineType.SubScript },
      [InlineType.Link]: { type: InlineType.Link },
    },
    creators: {
      editor: createHyperscriptEditor(() => editor),
    },
  })

export const testEditorWithAllPlugins = withList(
  withBlock(withTypography(withReact(createEditor()))),
)

export const jsx = createJsx(testEditorWithAllPlugins)

export const jsxWithInlineEditor = createJsx(withInlineMode(testEditorWithAllPlugins))
