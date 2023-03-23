/** @jsx jsx */

//@ts-ignore
import { TestEditor, jsx } from './slate-test-helper'
import { List } from '..'
import { describe, it, expect } from 'vitest'

describe('Indent', () => {
  it('WHEN indent on single item List THEN nothing happens', () => {
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

    List.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN indent on unindented second item in List THEN item is added to a new list within previous item', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>test</text>
          </listitemchild>
        </listitem>
        <listitem>
          <listitemchild>
            <text>
              te
              <cursor />
              st
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )
    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>test</text>
          </listitemchild>
          <unordered>
            <listitem>
              <listitemchild>
                <text>
                  te
                  <cursor />
                  st
                </text>
              </listitemchild>
            </listitem>
          </unordered>
        </listitem>
      </unordered>,
    )

    List.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN indent on unindented second item in ordered list THEN item is added to a new ordered list within previous item', () => {
    const editor = TestEditor(
      <ordered>
        <listitem>
          <listitemchild>
            <text>test</text>
          </listitemchild>
        </listitem>
        <listitem>
          <listitemchild>
            <text>
              te
              <cursor />
              st
            </text>
          </listitemchild>
        </listitem>
      </ordered>,
    )
    const result = TestEditor(
      <ordered>
        <listitem>
          <listitemchild>
            <text>test</text>
          </listitemchild>
          <ordered>
            <listitem>
              <listitemchild>
                <text>
                  te
                  <cursor />
                  st
                </text>
              </listitemchild>
            </listitem>
          </ordered>
        </listitem>
      </ordered>,
    )

    List.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN indent on where the previous item has children THEN then newly indented item is appended to those children', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>a</text>
          </listitemchild>
          <unordered>
            <listitem>
              <listitemchild>
                <text>b</text>
              </listitemchild>
            </listitem>
          </unordered>
        </listitem>
        <listitem>
          <listitemchild>
            <text>
              c <cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )
    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>a</text>
          </listitemchild>
          <unordered>
            <listitem>
              <listitemchild>
                <text>b</text>
              </listitemchild>
            </listitem>
            <listitem>
              <listitemchild>
                <text>
                  c <cursor />
                </text>
              </listitemchild>
            </listitem>
          </unordered>
        </listitem>
      </unordered>,
    )

    List.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
