/** @jsx jsx */

import { ComponentType } from 'react'
import { Editor as SlateEditor, createEditor } from 'slate'
import { createHyperscript, createEditor as createHyperscriptEditor } from 'slate-hyperscript'
import { withReact } from 'slate-react'

import { BlockType } from '../../controls'
import { withList, withTypography, withBlock } from '..'

export const jsx = createHyperscript({
  elements: {
    paragraph: { type: BlockType.Paragraph },

    heading1: { type: BlockType.Heading1 },
    heading2: { type: BlockType.Heading2 },
    heading3: { type: BlockType.Heading3 },
    heading4: { type: BlockType.Heading4 },
    heading5: { type: BlockType.Heading5 },
    heading6: { type: BlockType.Heading6 },

    blockquote: { type: BlockType.BlockQuote },

    unordered: { type: BlockType.UnorderedList },
    ordered: { type: BlockType.OrderedList },
    listitem: { type: BlockType.ListItem },
    listitemchild: { type: BlockType.ListItemChild },
  },
  creators: {
    editor: createHyperscriptEditor(() =>
      withBlock(withTypography(withList(withReact(createEditor())))),
    ),
  },
})

const EditorElement = 'editor' as any as ComponentType<{
  children: string | JSX.Element | (string | JSX.Element)[]
}>

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
export const Editor = (input: JSX.Element): SlateEditor => {
  return (<EditorElement>{input}</EditorElement>) as any as SlateEditor
}
