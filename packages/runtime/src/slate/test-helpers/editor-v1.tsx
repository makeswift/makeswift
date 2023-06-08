/** @jsx jsx */

import { ComponentType } from 'react'
import { Editor as SlateEditor } from 'slate'
import { jsx } from './slate-test-helper'

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
