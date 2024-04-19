/** @jsxRuntime classic */
/** @jsx jsx */

import {
  // @ts-expect-error: 'jsx' is declared but its value is never read.
  jsx,
  Editor,
  ListItem,
  ListItemChild,
  Paragraph,
  Unordered,
  Text,
  Fragment,
} from '../../test-helpers'
import { Editor as SlateEditor } from 'slate'

describe('Normalization', () => {
  it('WHEN listitem contains a paragraph THEN setNode to ListItemChild', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <Paragraph>
            <Text>test</Text>
          </Paragraph>
        </ListItem>
      </Unordered>,
    )
    const result = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>test</Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN list contains spare Text element THEN normalization removes it', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>test</Text>
          </ListItemChild>
        </ListItem>
        <Text></Text>
      </Unordered>,
    )
    const result = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>test</Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })

  it('WHEN non list root blocks contain other root block THEN normalization unwraps them', () => {
    const editor = Editor(
      <Paragraph>
        <Paragraph>
          <Text>abc</Text>
        </Paragraph>
        <Paragraph>
          <Text>xyz</Text>
        </Paragraph>
        <Paragraph>
          <Text>lmnop</Text>
        </Paragraph>
      </Paragraph>,
    )
    const result = Editor(
      <Fragment>
        <Paragraph>
          <Text>abc</Text>
        </Paragraph>
        <Paragraph>
          <Text>xyz</Text>
        </Paragraph>
        <Paragraph>
          <Text>lmnop</Text>
        </Paragraph>
      </Fragment>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
