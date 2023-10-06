/** @jsxRuntime classic */
/** @jsx jsxWithV2InlineEditor */

import { Editor as SlateEditor } from 'slate'
import {
  jsxWithV2InlineEditor,
  Ordered,
  Paragraph,
  Text,
  InlineEditor,
  Fragment,
  ListItem,
  ListItemChild,
  DefaultBlock,
} from '../../test-helpers'

describe('GIVEN inline mode', () => {
  it('WHEN normalizations are run on multiple paragraphs THEN paragraphs are merged and their block type is changed to text-block', () => {
    const editor = InlineEditor(
      <Fragment>
        <Paragraph>
          <Text>abc</Text>
        </Paragraph>
        <Paragraph>
          <Text>def</Text>
        </Paragraph>
      </Fragment>,
    )
    const result = InlineEditor(
      <DefaultBlock>
        <Text>abc</Text>
        <Text>def</Text>
      </DefaultBlock>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
  it('WHEN normalizations are run on ordered list THEN nested blocks are unwrapped, types are changed to text-block, and root blocks are merged', () => {
    const editor = InlineEditor(
      <Fragment>
        <Ordered>
          <ListItem>
            <ListItemChild>abc</ListItemChild>
          </ListItem>
          <ListItem>
            <ListItemChild>def</ListItemChild>
          </ListItem>
        </Ordered>
      </Fragment>,
    )
    const result = InlineEditor(
      <DefaultBlock>
        <Text>abc</Text>
        <Text>def</Text>
      </DefaultBlock>,
    )

    SlateEditor.normalize(editor, { force: true })

    expect(editor.children).toEqual(result.children)
    expect(editor.selection).toEqual(result.selection)
  })
})
