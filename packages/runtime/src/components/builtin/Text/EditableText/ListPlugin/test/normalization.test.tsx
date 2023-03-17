/** @jsx jsx */

//@ts-ignore
import { jsx, TestEditor } from './slate-test-helper'
import { describe, it, expect } from 'vitest'
import { Editor } from 'slate'

describe('Normalization', () => {
  it('WHEN listitem contains a paragraph THEN setNode to listitemchild', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <paragraph>
            <text>test</text>
          </paragraph>
        </listitem>
      </unordered>,
    )
    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>test</text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    Editor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN list contains spare text element THEN normalization removes it', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>test</text>
          </listitemchild>
        </listitem>
        <text></text>
      </unordered>,
    )
    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>test</text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    Editor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
