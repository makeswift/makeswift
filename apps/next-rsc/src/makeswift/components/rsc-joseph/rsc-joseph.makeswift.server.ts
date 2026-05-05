import { Color, Slot, Style } from "@makeswift/runtime/controls"
import { RscJoseph } from "./rsc-joseph"

import { runtime } from "@/makeswift/runtime"

runtime.registerComponent(RscJoseph, {
  type: 'rsc-joseph',
  label: 'Custom / RSC Joseph',
  props: {
    classNameA: Style({ properties: Style.All}),
    classNameB: Style({ properties: Style.All}),
    children: Slot(),
    colorA: Color(),
    colorB: Color(),
  },
  server: true,
})
