import { Checkbox } from '../../checkbox'
import { Select } from '../../select'

import { StyleV2, StyleV2Definition } from './testing'

const textAlign = Select({
  label: 'Alignment',
  options: [
    {
      label: 'Left Align',
      value: 'left',
    },
    {
      label: 'Center Align',
      value: 'center',
    },
    {
      label: 'Right Align',
      value: 'right',
    },
  ],
  defaultValue: 'left',
})

const visibility = Checkbox({ defaultValue: true })

describe('StyleV2', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(
        StyleV2({
          type: textAlign,
          getStyle(textAlign) {
            return { textAlignment: textAlign }
          },
        }),
      ).toMatchSnapshot('text alignment')

      expect(
        StyleV2({
          type: visibility,
          getStyle(visibility) {
            return { visibility: visibility ? 'visible' : 'hidden' }
          },
        }),
      ).toMatchSnapshot('visibility')
    })

    test('disallows extraneous properties', () => {
      StyleV2({
        type: textAlign,
        getStyle(textAlign) {
          return { textAlignment: textAlign }
        },
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: StyleV2Definition) {}
    assignTest(
      StyleV2({
        type: textAlign,
        getStyle(textAlign) {
          return { textAlignment: textAlign }
        },
      }),
    )

    assignTest(
      StyleV2({
        type: visibility,
        getStyle(visibility) {
          return { visibility: visibility ? 'visible' : 'hidden' }
        },
      }),
    )
  })
})
