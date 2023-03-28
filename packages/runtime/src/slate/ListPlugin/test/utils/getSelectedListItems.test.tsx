/** @jsx jsx */

//@ts-ignore
import { TestEditor, jsx } from '../slate-test-helper'
import { describe, it, expect } from 'vitest'
import { getSelectedListItems } from '../../lib/utils/getSelectedListItems'

describe('getSelectedListItems', () => {
  it('WHEN no selection is made THEN returns empty array', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>Nested Lists A</text>
          </listitemchild>
        </listitem>
        <listitem>
          <listitemchild>
            <text>Nested Lists C</text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    const listitemsInRange = getSelectedListItems(editor)
    expect(listitemsInRange).toEqual([])
  })
  it('WHEN cursor in is list item THEN returns that list item', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>Nested Lists A</text>
          </listitemchild>
        </listitem>
        <listitem>
          <listitemchild>
            <text>
              Nested Lists C<cursor />
            </text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    const listitemsInRange = getSelectedListItems(editor)
    const listitemsPathsInRange = listitemsInRange.map(([, path]) => path)
    expect(listitemsPathsInRange).toEqual([[0, 1]])
  })

  it('WHEN a selection is made THEN returns all selected list items', () => {
    const editor = TestEditor(
      <unordered>
        <listitem>
          <listitemchild>
            <text>Nested Lists A</text>
          </listitemchild>
          <unordered>
            <listitem>
              <listitemchild>
                <text>Nested Lists A1</text>
              </listitemchild>
              <ordered>
                <listitem>
                  <listitemchild>
                    <text>Nested Lists A1a</text>
                  </listitemchild>
                </listitem>
                <listitem>
                  <listitemchild>
                    <text>Nested Lists A1b</text>
                  </listitemchild>
                </listitem>
              </ordered>
            </listitem>
            <listitem>
              <listitemchild>
                <text>
                  Nested
                  <anchor /> Lists A2
                </text>
              </listitemchild>
              <unordered>
                <listitem>
                  <listitemchild>
                    <text>Nested Lists A2a</text>
                  </listitemchild>
                </listitem>
                <listitem>
                  <listitemchild>
                    <text>Nested Lists A2b</text>
                  </listitemchild>
                </listitem>
              </unordered>
            </listitem>
            <listitem>
              <listitemchild>
                <text>Nested Lists A3</text>
              </listitemchild>
            </listitem>
          </unordered>
        </listitem>
        <listitem>
          <listitemchild>
            <text>Nested Lists B</text>
          </listitemchild>
          <ordered>
            <listitem>
              <listitemchild>
                <text>Nested Lists B1</text>
              </listitemchild>
              <unordered>
                <listitem>
                  <listitemchild>
                    <text>Nested Lists B1a</text>
                  </listitemchild>
                </listitem>
                <listitem>
                  <listitemchild>
                    <text>
                      Nested Lists
                      <focus /> B1b
                    </text>
                  </listitemchild>
                </listitem>
              </unordered>
            </listitem>
            <listitem>
              <listitemchild>
                <text>Nested Lists B2</text>
              </listitemchild>
            </listitem>
          </ordered>
        </listitem>
        <listitem>
          <listitemchild>
            <text>Nested Lists C</text>
          </listitemchild>
        </listitem>
      </unordered>,
    )

    const listitemsInRange = getSelectedListItems(editor)
    const listitemsPathsInRange = listitemsInRange.map(([, path]) => path)

    expect(listitemsPathsInRange).toEqual([
      [0, 0, 1, 1],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1],
      [0, 0, 1, 2],
      [0, 1],
      [0, 1, 1, 0],
      [0, 1, 1, 0, 1, 0],
      [0, 1, 1, 0, 1, 1],
    ])
  })
})
