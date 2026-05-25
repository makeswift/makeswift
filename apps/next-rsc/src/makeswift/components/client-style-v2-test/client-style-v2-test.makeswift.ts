import { runtime } from '@/makeswift/runtime'
import { Checkbox, unstable_StyleV2, TextInput } from '@makeswift/runtime/controls'
import { ClientStyleV2Test } from './client-style-v2-test'
import { CSSObject } from '@emotion/serialize'

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

function getHoverStyle(useFunHover: boolean) {
  return {
    transition: 'background 0.15s ease-in-out',
    ':hover': {
      background: useFunHover ? 'purple' : 'white',
    },
  }
}