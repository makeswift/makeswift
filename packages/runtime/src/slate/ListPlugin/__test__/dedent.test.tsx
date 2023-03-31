/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { List } from '..'
import { Editor, jsx, Cursor, ListItem, ListItemChild, Text, Unordered } from '../../test-helpers'

describe('Dedent List', () => {
  it('WHEN dedent on single item List THEN nothing happens', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>
              test <Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>
              test <Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    List.dedent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN dedent on indented second item in List THEN item is dedented', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>a</Text>
          </ListItemChild>
          <Unordered>
            <ListItem>
              <ListItemChild>
                <Text>
                  a<Cursor />b
                </Text>
              </ListItemChild>
            </ListItem>
          </Unordered>
        </ListItem>
      </Unordered>,
    )

    const result = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>a</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              a<Cursor />b
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    List.dedent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN dedent on indented second item in List THEN dedented item is appended to root list', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>a</Text>
          </ListItemChild>
          <Unordered>
            <ListItem>
              <ListItemChild>
                <Text>b</Text>
              </ListItemChild>
            </ListItem>
            <ListItem>
              <ListItemChild>
                <Text>
                  c <Cursor />
                </Text>
              </ListItemChild>
            </ListItem>
          </Unordered>
        </ListItem>
      </Unordered>,
    )

    const result = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>a</Text>
          </ListItemChild>
          <Unordered>
            <ListItem>
              <ListItemChild>
                <Text>b</Text>
              </ListItemChild>
            </ListItem>
          </Unordered>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              c <Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    List.dedent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
