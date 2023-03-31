/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import {
  Unordered,
  Text,
  ListItem,
  ListItemChild,
  Cursor,
  Paragraph,
  Anchor,
  Focus,
  Fragment,
  Editor,
  jsx,
} from '../../test-helpers'
import { List } from '..'

describe('Unwrap List', () => {
  it('WHEN unwrapList on List THEN turns into a paragraph', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>
              a <Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Paragraph>
        <Text>
          a <Cursor />
        </Text>
      </Paragraph>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN unwrapList on one of many ListItems THEN just that list Item is unwrapped', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>a</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              b <Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Fragment>
        <Unordered>
          <ListItem>
            <ListItemChild>
              <Text>a</Text>
            </ListItemChild>
          </ListItem>
        </Unordered>
        <Paragraph>
          <Text>
            b <Cursor />
          </Text>
        </Paragraph>
      </Fragment>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN unwrapList on range of multiple list item children THEN turns each into a paragraph', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>
              a <Anchor />
            </Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              b <Focus />
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Fragment>
        <Paragraph>
          <Text>
            a <Anchor />
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>
            b <Focus />
          </Text>
        </Paragraph>
      </Fragment>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN unwrapList on Paragraph THEN nothing happens', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          test <Cursor />
        </Text>
      </Paragraph>,
    )

    const result = Editor(
      <Paragraph>
        <Text>
          test <Cursor />
        </Text>
      </Paragraph>,
    )

    List.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
