/** @jsxRuntime classic */
/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { ListActions } from '..'
import {
  // @ts-expect-error: 'jsx' is declared but its value is never read.
  jsx,
  Editor,
  Cursor,
  ListItem,
  ListItemChild,
  Ordered,
  Unordered,
  Text,
} from '../../test-helpers'

describe('Indent', () => {
  it('WHEN indent on single item List THEN nothing happens', () => {
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

    ListActions.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN indent on unindented second item in List THEN item is added to a new list within previous item', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>test</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              te
              <Cursor />
              st
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>test</Text>
          </ListItemChild>
          <Unordered>
            <ListItem>
              <ListItemChild>
                <Text>
                  te
                  <Cursor />
                  st
                </Text>
              </ListItemChild>
            </ListItem>
          </Unordered>
        </ListItem>
      </Unordered>,
    )

    ListActions.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN indent on unindented second item in Ordered list THEN item is added to a new Ordered list within previous item', () => {
    const editor = Editor(
      <Ordered>
        <ListItem>
          <ListItemChild>
            <Text>test</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              te
              <Cursor />
              st
            </Text>
          </ListItemChild>
        </ListItem>
      </Ordered>,
    )
    const result = Editor(
      <Ordered>
        <ListItem>
          <ListItemChild>
            <Text>test</Text>
          </ListItemChild>
          <Ordered>
            <ListItem>
              <ListItemChild>
                <Text>
                  te
                  <Cursor />
                  st
                </Text>
              </ListItemChild>
            </ListItem>
          </Ordered>
        </ListItem>
      </Ordered>,
    )

    ListActions.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN indent on where the previous item has children THEN then newly indented item is appended to those children', () => {
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

    ListActions.indent(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
