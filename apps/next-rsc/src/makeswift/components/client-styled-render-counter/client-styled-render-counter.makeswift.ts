'use client'

import { runtime } from "@/makeswift/runtime"
import { Style } from "@makeswift/runtime/controls"
import { ClientStyledRenderCounter } from "./client-styled-render-counter"

runtime.registerComponent(ClientStyledRenderCounter, {
  type: 'client-styled-render-counter',
  label: 'Custom / Client Styled Render Counter',
  props: {
    className: Style({ properties: Style.All}),
  },
})
