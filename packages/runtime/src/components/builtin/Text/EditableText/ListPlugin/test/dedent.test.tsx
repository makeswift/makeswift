/** @jsx jsx */

//@ts-ignore
import { TestEditor, jsx } from './slate-test-helper'
import { List } from '..'
import { describe, it, expect } from 'vitest'

describe('Dedent List', () => {
  it('WHEN dedent on single item List THEN nothing happens', () => {
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

    List.dedent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN dedent on indented second item in List THEN item is dedented', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>a</text>
          </listitemchild>
          <unordered>
            <listitem>
              <listitemchild>
                <text>
                  a<cursor />b
                </text>
              </listitemchild>
            </listitem>
          </unordered>
        </listitem>
      </unordered>,
    )

    const result = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>a</text>
          </listitemchild>
        </listitem>
        <listitem>
          <listitemchild>
            <text>
              a<cursor />b
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    List.dedent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN dedent on indented second item in List THEN dedented item is appended to root list', () => {
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

    List.dedent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
