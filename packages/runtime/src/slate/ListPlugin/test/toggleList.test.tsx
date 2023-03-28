/** @jsx jsx */

//@ts-ignore
import { jsx, TestEditor } from './slate-test-helper'
import { List } from '..'
import { describe, it, expect } from 'vitest'

describe('toggleList', () => {
  it('WHEN toggleList to unordered on paragraph THEN turns to unordered', () => {
    const editor = TestEditor(
      <paragraph>
        <text>
          a <cursor />
        </text>
      </paragraph>,
    )

    const result = TestEditor(
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

    List.toggleList(editor, { type: 'unordered-list' })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN toggleList to unordered on unordered THEN turns to paragraph', () => {
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

    List.toggleList(editor, { type: 'unordered-list' })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN toggleList to ordered on unordered THEN turns to ordered', () => {
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
      <ordered>
        <listitem>
          <listitemchild>
            <text>
              a <cursor />
            </text>
          </listitemchild>
        </listitem>
      </ordered>,
    )

    List.toggleList(editor, { type: 'ordered-list' })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN toggleList on two types of list THEN they are merged into one list', () => {
    const editor = TestEditor(
      <fragment>
        <unordered>
          <listitem>
            <listitemchild>
              <text>
                a <anchor />
              </text>
            </listitemchild>
          </listitem>
        </unordered>
        <ordered>
          <listitem>
            <listitemchild>
              <text>
                c <focus />
              </text>
            </listitemchild>
          </listitem>
        </ordered>
      </fragment>,
    )

    const result = TestEditor(
      <ordered>
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
              c <focus />
            </text>
          </listitemchild>
        </listitem>
      </ordered>,
    )

    List.toggleList(editor, { type: 'ordered-list' })
    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
