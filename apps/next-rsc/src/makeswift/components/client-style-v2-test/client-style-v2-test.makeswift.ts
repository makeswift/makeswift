import { runtime } from '@/makeswift/runtime'
import { Checkbox, unstable_StyleV2, TextInput } from '@makeswift/runtime/controls'
import { ClientStyleV2Test } from './client-style-v2-test'

runtime.registerComponent(ClientStyleV2Test, {
  type: 'client-style-v2-test',
  label: 'Custom / Client Style V2 Test',
  props: {
    className: unstable_StyleV2({
      type: Checkbox({ label: 'Use Fun Hover', defaultValue: false }),
      getStyle: (useFunHover) => {
        return getHoverStyle(useFunHover ?? false)
      }
    }),
    text: TextInput({ label: 'Text', defaultValue: 'Hello, world!' }),
  },
})

/*
  Whether the style object below uses:

  '&:hover'
  or
  ':hover'

  is useful for demoing a behavioral difference
  between Emotion and what we have right now. Emotion
  (via a Stylis plugin used by its cache) would assume
  the intent of the developer was to make the ':hover'
  apply to the parent, and based on this assumption would
  append a '&' before ':hover' during css preprocessing.

  If we don't make that assumption, then the result of omitting
  the '&' below would be that the hover effect applies to descendants
  rather than to the parent (a descendant selector gets created)

*/
function getHoverStyle(useFunHover: boolean) {
  return {
    transition: 'background 0.15s ease-in-out',
    '&:hover': {
      background: useFunHover ? 'purple' : 'white',
    },
  }
}