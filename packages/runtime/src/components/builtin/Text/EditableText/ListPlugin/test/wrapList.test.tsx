/** @jsx jsx */

//@ts-ignore
import { TestEditor, jsx } from './slate-test-helper'
import { List } from '..'
import { describe, it, expect } from 'vitest'
import { BlockType } from '../../../../../../controls'

describe('Wrap List', () => {
  it('WHEN wrapList on Paragraph THEN turns in to an Unordered List', () => {
    const editor = TestEditor(
      <paragraph>
        <text>
          test <cursor />
        </text>
      </paragraph>,
    )
    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>
              test <cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    List.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on Heading1 THEN turns in to an Unordered List', () => {
    const editor = TestEditor(
      <heading1>
        <text>
          test <cursor />
        </text>
      </heading1>,
    )
    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>
              test <cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    List.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on Heading1 THEN turns in to an Unordered List', () => {
    const editor = TestEditor(
      <fragment>
        <heading1>
          <text>
            a <anchor />
          </text>
        </heading1>
        <paragraph>
          <text>
            b <focus />
          </text>
        </paragraph>
      </fragment>,
    )
    const result = TestEditor(
      <fragment>
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
        </unordered>
      </fragment>,
    )

    List.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on Unordered List THEN nothing happens', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>
              test <cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>
              test <cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    List.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN wrapList on valid node and specify Ordered List type option THEN node is wrapped in Ordered List node', () => {
    const editor = TestEditor(
      <paragraph>
        <text>
          test <cursor />
        </text>
      </paragraph>,
    )

    const result = TestEditor(
      <ordered>
        <listitem>
          <listitemchild>
            <text>
              test <cursor />
            </text>
          </listitemchild>
        </listitem>
      </ordered>,
    )

    List.wrapList(editor, { type: BlockType.OrderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
