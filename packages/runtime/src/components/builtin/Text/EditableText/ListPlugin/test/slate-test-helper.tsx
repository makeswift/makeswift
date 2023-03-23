/** @jsx jsx */

import { BaseEditor, createEditor, Editor as SlateEditor } from 'slate'
import { createHyperscript, createEditor as createHyperscriptEditor } from 'slate-hyperscript'
import { ReactEditor, withReact } from 'slate-react'
import {
  BlockQuote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ListItem,
  ListItemChild,
  Ordered,
  Paragraph,
  Text,
  Typography,
  Unordered,
} from './types'
import { TextType, BlockType } from '../../../../../../controls'
import { withList } from '../ListPlugin'

export const jsx = createHyperscript({
  elements: {
    [Text]: { type: TextType.Text },
    [Typography]: { type: TextType.Typography },

    [Paragraph]: { type: BlockType.Paragraph },

    [Heading1]: { type: BlockType.Heading1 },
    [Heading2]: { type: BlockType.Heading2 },
    [Heading3]: { type: BlockType.Heading3 },
    [Heading4]: { type: BlockType.Heading4 },
    [Heading5]: { type: BlockType.Heading5 },
    [Heading6]: { type: BlockType.Heading6 },

    [BlockQuote]: { type: BlockType.BlockQuote },

    [Unordered]: { type: BlockType.UnorderedList },
    [Ordered]: { type: BlockType.OrderedList },
    [ListItem]: { type: BlockType.ListItem },
    [ListItemChild]: { type: BlockType.ListItemChild },
  },
  creators: {
    editor: createHyperscriptEditor(() => withList(withReact(createEditor()))),
  },
})

/**
 * Note: If you tried to add the react plugin to the vitest config
 * 1. You have to use {jsxRuntime: "classic"} since we are using pragmas in these tests
 * 2. You will get a circular dependency error in slate because the plugin uses these
 *    two plugins to get better stack traces in react.
 *    - https://babeljs.io/docs/babel-plugin-transform-react-jsx-self/
 *    - https://babeljs.io/docs/babel-plugin-transform-react-jsx-source/
 *    Either find a way to disable them or clean the properties in `TestEditor` with
 *
 *    ```
 *    function clean(child: any) {
 *      const { __self, __source, ...nextChild } = child
 *      if ('children' in nextChild) {
 *        nextChild.children = nextChild.children.map((child: any) => clean(child))
 *      }
 *      return nextChild
 *    }
 *    editor.children = editor.children.map(child => clean(child))
 *    ```
 *    More clues: https://github.com/preactjs/preact/issues/1058#issuecomment-379007804
 */
export const TestEditor = (input: JSX.Element): SlateEditor => {
  return (<editor>{input}</editor>) as any as ReactEditor & BaseEditor
}
