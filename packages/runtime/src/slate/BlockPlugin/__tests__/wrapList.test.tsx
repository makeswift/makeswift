/** @jsxRuntime classic */
/** @jsx jsx */

import { ListActions } from '..'
import { BlockType } from '../..'
import {
  // @ts-expect-error: 'jsx' is declared but its value is never read.
  jsx,
  Editor,
  Paragraph,
  Cursor,
  Unordered,
  ListItem,
  ListItemChild,
  Anchor,
  Focus,
  Ordered,
  Text,
  Heading1,
  Fragment,
} from '../../test-helpers'

describe('Wrap List', () => {
  it('WHEN wrapList on Paragraph THEN turns in to an Unordered List', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          test <Cursor />
        </Text>
      </Paragraph>,
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

    ListActions.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on Heading1 THEN turns in to an Unordered List', () => {
    const editor = Editor(
      <Heading1>
        <Text>
          test <Cursor />
        </Text>
      </Heading1>,
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

    ListActions.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on Heading1 & Paragraph THEN turns in to an Unordered List', () => {
    const editor = Editor(
      <Fragment>
        <Heading1>
          <Text>
            a <Anchor />
          </Text>
        </Heading1>
        <Paragraph>
          <Text>
            b <Focus />
          </Text>
        </Paragraph>
      </Fragment>,
    )
    const result = Editor(
      <Fragment>
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
        </Unordered>
      </Fragment>,
    )

    ListActions.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on Unordered List THEN nothing happens', () => {
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

    ListActions.wrapList(editor)

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN wrapList on valid node and specify Ordered List type option THEN node is wrapped in Ordered List node', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          test <Cursor />
        </Text>
      </Paragraph>,
    )

    const result = Editor(
      <Ordered>
        <ListItem>
          <ListItemChild>
            <Text>
              test <Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Ordered>,
    )

    ListActions.wrapList(editor, { type: BlockType.OrderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on paragraph adjacent to list THEN normalization merges lists together', () => {
    const editor = Editor(
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
    const result = Editor(
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

    ListActions.wrapList(editor, { type: BlockType.UnorderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN wrapList on range of paragraphs adjacent to list THEN normalization merges lists together', () => {
    const editor = Editor(
      <Fragment>
        <Paragraph>
          <Text>
            a<Anchor />
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>
            b<Focus />
          </Text>
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
    const result = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>
              a<Anchor />
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

    ListActions.wrapList(editor, { type: BlockType.UnorderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
