import {
  unstable_IconRadioGroup as IconRadioGroup,
  unstable_IconRadioGroupIcon,
} from './icon-radio-group'
import { testDefinition } from '../tests/test-definition'

describe('unstable_IconRadioGroup', () => {
  test('constructor', () => {
    const def = IconRadioGroup({
      label: 'Block type',
      labelOrientation: 'horizontal',
      options: [
        {
          value: 'code',
          label: 'Code',
          icon: unstable_IconRadioGroupIcon.Code,
        },
        {
          value: 'superscript',
          label: 'Superscript',
          icon: unstable_IconRadioGroupIcon.Superscript,
        },
      ],
      defaultValue: 'code',
    })

    expect(def).toMatchSnapshot()
  })

  const invalidValues = [null, 17, 'random', { swatchId: 42 }]

  testDefinition(
    IconRadioGroup({
      label: 'Block type',
      labelOrientation: 'horizontal',
      options: [
        {
          value: 'code',
          label: 'Code',
          icon: unstable_IconRadioGroupIcon.Code,
        },
        {
          value: 'superscript',
          label: 'Superscript',
          icon: unstable_IconRadioGroupIcon.Superscript,
        },
      ],
      defaultValue: 'code',
    }),
    ['code', 'superscript'],
    invalidValues,
  )
})
