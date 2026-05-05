import { Slot, Style, unstable_IconRadioGroup, unstable_StyleV2 } from "@makeswift/runtime/controls"
import { RscNestedStyleTest } from "./rsc-nested-style-test"

import { runtime } from "@/makeswift/runtime"

runtime.registerComponent(RscNestedStyleTest, {
  type: 'rsc-nested-style-test',
  label: 'Custom / RSC Nested Style Test',
  props: {
    className: Style({ properties: Style.All}),
    children: Slot(),
  },
  server: true,
})