import { expectTypeOf } from 'expect-type'

import { Checkbox } from '../checkbox'
import { Color } from '../color'
import { Image } from '../image'
import { GenericLink as Link } from '../link'
import { List } from '../list'
import { Select } from '../select'
import { Shape } from '../shape'
import { TextArea } from '../text-area'
import { TextInput } from '../text-input'

/**
 * In some implementations, props are defined in a separate variable
 * that is exported to be used across multiple component registrations. With
 * more complex prop structures, sometimes the exported props cannot be
 * interpretted by TypeScript, and you'll see the following error:
 *
 * ```
 * The inferred type of this node exceeds the maximum length the compiler will
 * serialize. An explicit type annotation is needed
 * ```
 *
 * This test exists to ensure that exported props can have their types inferred
 * correctly. This file will compile with an error if the type of props cannot
 * be inferred.
 */

export const props = {
  cards: List({
    label: 'Cards',
    type: Shape({
      type: {
        imageSrc: Image({
          label: 'Image',
        }),
        imageAlt: TextInput({
          label: 'Alt text',
          defaultValue: 'Image',
        }),
        heading: TextInput({
          label: 'Heading',
          defaultValue: 'Case study',
        }),
        title: TextInput({
          label: 'Title',
          defaultValue: 'This is a title',
        }),
        text: TextArea({
          label: 'Text',
          defaultValue: 'Lorem ipsum',
        }),
        linkText: TextInput({
          label: 'Link text',
          defaultValue: 'Read more',
        }),
        linkURL: Link({ label: 'On click' }),
      },
    }),
    getItemLabel(item) {
      return item?.title ?? 'This is a title'
    },
  }),
  background: Color({ label: 'Background color' }),
  variant: Select({
    label: 'Text color',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
    defaultValue: 'light',
  }),
  boolean: Checkbox({ label: 'Boolean', defaultValue: true }),
  number: Number({
    label: 'My Number',
    selectAll: true,
  }),
}

test('large exported prop definitions compile', () => {
  expectTypeOf(props).toMatchTypeOf({})
})
