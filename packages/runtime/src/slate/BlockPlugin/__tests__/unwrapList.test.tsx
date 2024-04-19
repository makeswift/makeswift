/** @jsxRuntime classic */
/** @jsx jsx */

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
  // @ts-expect-error: 'jsx' is declared but its value is never read.
  jsx,
} from '../../test-helpers'
import { ListActions } from '..'

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

    ListActions.unwrapList(editor)

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

    ListActions.unwrapList(editor)

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

    ListActions.unwrapList(editor)

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

    ListActions.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN unwrapList on single node THEN it is removed from list', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>
              a<Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>b</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>c</Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Fragment>
        <Paragraph>
          <Text>
            a<Cursor />
          </Text>
        </Paragraph>
        <Unordered>
          <ListItem>
            <ListItemChild>
              <Text>b</Text>
            </ListItemChild>
          </ListItem>
          <ListItem>
            <ListItemChild>
              <Text>c</Text>
            </ListItemChild>
          </ListItem>
        </Unordered>
      </Fragment>,
    )

    ListActions.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN unwrapList on range of underorderlist items THEN they are removed from list', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>
              <Anchor />a
            </Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              b<Focus />
            </Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>c</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>d</Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Fragment>
        <Paragraph>
          <Text>a</Text>
        </Paragraph>
        <Paragraph>
          <Text>b</Text>
        </Paragraph>
        <Unordered>
          <ListItem>
            <ListItemChild>
              <Text>c</Text>
            </ListItemChild>
          </ListItem>
          <ListItem>
            <ListItemChild>
              <Text>d</Text>
            </ListItemChild>
          </ListItem>
        </Unordered>
      </Fragment>,
    )

    ListActions.unwrapList(editor)

    expect(editor.children).toEqual(result.children)
  })
})
