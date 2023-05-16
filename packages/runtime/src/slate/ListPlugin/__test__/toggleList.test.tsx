/** @jsxRuntime classic */
/** @jsx jsx */

import {
  jsx,
  Editor,
  Paragraph,
  Anchor,
  Cursor,
  Focus,
  Fragment,
  ListItem,
  ListItemChild,
  Ordered,
  Unordered,
  Text,
} from '../../test-helpers'
import { BlockType } from '@makeswift/runtime/slate'
import { List } from '..'

describe('toggleList', () => {
  it('WHEN toggleList to Unordered on paragraph THEN turns to Unordered', () => {
    const editor = Editor(
      <Paragraph>
        <Text>
          a <Cursor />
        </Text>
      </Paragraph>,
    )

    const result = Editor(
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

    List.toggleList(editor, { type: BlockType.UnorderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN toggleList to Unordered on Unordered THEN turns to paragraph', () => {
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

    List.toggleList(editor, { type: BlockType.UnorderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN toggleList to Ordered on Unordered THEN turns to Ordered', () => {
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
      <Ordered>
        <ListItem>
          <ListItemChild>
            <Text>
              a <Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Ordered>,
    )

    List.toggleList(editor, { type: BlockType.OrderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN toggleList on two types of list THEN they are merged into one list', () => {
    const editor = Editor(
      <Fragment>
        <Unordered>
          <ListItem>
            <ListItemChild>
              <Text>
                a <Anchor />
              </Text>
            </ListItemChild>
          </ListItem>
        </Unordered>
        <Ordered>
          <ListItem>
            <ListItemChild>
              <Text>
                c <Focus />
              </Text>
            </ListItemChild>
          </ListItem>
        </Ordered>
      </Fragment>,
    )

    const result = Editor(
      <Ordered>
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
              c <Focus />
            </Text>
          </ListItemChild>
        </ListItem>
      </Ordered>,
    )

    List.toggleList(editor, { type: 'ordered-list' })
    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN toggleList to Unordered on paragraph THEN turns to Unordered', () => {
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
            <Text>b</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              c <Focus />
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
          <Text>b</Text>
        </Paragraph>
        <Paragraph>
          <Text>
            c <Focus />
          </Text>
        </Paragraph>
      </Fragment>,
    )

    List.toggleList(editor, { type: BlockType.UnorderedList })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
