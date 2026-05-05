import { runtime } from "@/makeswift/runtime"
import { Slot, Style } from "@makeswift/runtime/controls"
import { ClientNestedStyleTest } from "./client-nested-style-test"

runtime.registerComponent(ClientNestedStyleTest, {
  type: 'client-nested-style-test',
  label: 'Custom / Client Nested Style Test',
  props: {
    className: Style({ properties: Style.All}),
    children: Slot(),
  },
})