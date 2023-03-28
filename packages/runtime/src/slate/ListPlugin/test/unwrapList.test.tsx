/** @jsx jsx */

//@ts-ignore
import { jsx, TestEditor } from './slate-test-helper'
import { List } from '..'
import { describe, it, expect } from 'vitest'

describe('Unwrap List', () => {
  it('WHEN unwrapList on List THEN turns into a paragraph', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>
              a <cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )
    const result = TestEditor(
      <paragraph>
        <text>
          a <cursor />
        </text>
      </paragraph>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN unwrapList on one of many listItems THEN just that list Item is unwrapped', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>a</text>
          </listitemchild>
        </listitem>
        <listitem>
          <listitemchild>
            <text>
              b <cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )
    const result = TestEditor(
      <fragment>
        <unordered>
          <listitem>
            <listitemchild>
              <text>a</text>
            </listitemchild>
          </listitem>
        </unordered>
        <paragraph>
          <text>
            b <cursor />
          </text>
        </paragraph>
      </fragment>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN unwrapList on range of multiple list item children THEN turns each into a paragraph', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>
              a <anchor />
            </text>
          </listitemchild>
        </listitem>
        <listitem>
          <listitemchild>
            <text>
              b <focus />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )
    const result = TestEditor(
      <fragment>
        <paragraph>
          <text>
            a <anchor />
          </text>
        </paragraph>
        <paragraph>
          <text>
            b <focus />
          </text>
        </paragraph>
      </fragment>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN unwrapList on Paragraph THEN nothing happens', () => {
    const editor = TestEditor(
      <paragraph>
        <text>
          test <cursor />
        </text>
      </paragraph>,
    )

    const result = TestEditor(
      <paragraph>
        <text>
          test <cursor />
        </text>
      </paragraph>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
