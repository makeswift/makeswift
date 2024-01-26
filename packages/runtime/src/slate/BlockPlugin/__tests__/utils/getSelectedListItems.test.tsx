/** @jsxRuntime classic */
/** @jsx jsx */

import { describe, it, expect } from 'vitest'
import { getSelectedListItems } from '../../utils/getSelectedListItems'
import {
  Editor,
  // @ts-expect-error: 'jsx' is declared but its value is never read.
  jsx,
  Unordered,
  ListItem,
  ListItemChild,
  Text,
  Cursor,
  Anchor,
  Focus,
  Ordered,
} from '../../../test-helpers'

describe('getSelectedListItems', () => {
  it('WHEN no selection is made THEN returns empty array', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>Nested Lists A</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>Nested Lists C</Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    const ListItemsInRange = getSelectedListItems(editor)
    expect(ListItemsInRange).toEqual([])
  })
  it('WHEN cursor in is list item THEN returns that list item', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>Nested Lists A</Text>
          </ListItemChild>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>
              Nested Lists C<Cursor />
            </Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    const ListItemsInRange = getSelectedListItems(editor)
    const ListItemsPathsInRange = ListItemsInRange.map(([, path]) => path)
    expect(ListItemsPathsInRange).toEqual([[0, 1]])
  })

  it('WHEN a selection is made THEN returns all selected list items', () => {
    const editor = Editor(
      <Unordered>
        <ListItem>
          <ListItemChild>
            <Text>Nested Lists A</Text>
          </ListItemChild>
          <Unordered>
            <ListItem>
              <ListItemChild>
                <Text>Nested Lists A1</Text>
              </ListItemChild>
              <Ordered>
                <ListItem>
                  <ListItemChild>
                    <Text>Nested Lists A1a</Text>
                  </ListItemChild>
                </ListItem>
                <ListItem>
                  <ListItemChild>
                    <Text>Nested Lists A1b</Text>
                  </ListItemChild>
                </ListItem>
              </Ordered>
            </ListItem>
            <ListItem>
              <ListItemChild>
                <Text>
                  Nested
                  <Anchor /> Lists A2
                </Text>
              </ListItemChild>
              <Unordered>
                <ListItem>
                  <ListItemChild>
                    <Text>Nested Lists A2a</Text>
                  </ListItemChild>
                </ListItem>
                <ListItem>
                  <ListItemChild>
                    <Text>Nested Lists A2b</Text>
                  </ListItemChild>
                </ListItem>
              </Unordered>
            </ListItem>
            <ListItem>
              <ListItemChild>
                <Text>Nested Lists A3</Text>
              </ListItemChild>
            </ListItem>
          </Unordered>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>Nested Lists B</Text>
          </ListItemChild>
          <Ordered>
            <ListItem>
              <ListItemChild>
                <Text>Nested Lists B1</Text>
              </ListItemChild>
              <Unordered>
                <ListItem>
                  <ListItemChild>
                    <Text>Nested Lists B1a</Text>
                  </ListItemChild>
                </ListItem>
                <ListItem>
                  <ListItemChild>
                    <Text>
                      Nested Lists
                      <Focus /> B1b
                    </Text>
                  </ListItemChild>
                </ListItem>
              </Unordered>
            </ListItem>
            <ListItem>
              <ListItemChild>
                <Text>Nested Lists B2</Text>
              </ListItemChild>
            </ListItem>
          </Ordered>
        </ListItem>
        <ListItem>
          <ListItemChild>
            <Text>Nested Lists C</Text>
          </ListItemChild>
        </ListItem>
      </Unordered>,
    )

    const ListItemsInRange = getSelectedListItems(editor)
    const ListItemsPathsInRange = ListItemsInRange.map(([, path]) => path)

    expect(ListItemsPathsInRange).toEqual([
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
