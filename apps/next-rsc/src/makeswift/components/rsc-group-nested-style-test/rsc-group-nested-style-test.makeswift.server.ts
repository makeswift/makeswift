import { runtime } from "@/makeswift/runtime"
import { Group, Style } from "@makeswift/runtime/controls"
import { RSCGroupNestedStyleTest } from "./rsc-group-nested-style-test"

runtime.registerComponent(RSCGroupNestedStyleTest, {
  type: 'rsc-group-nested-style-test',
  label: 'Custom / RSC Group Nested Style Test',
  props: {
    groupA: Group({
      props: {
        className: Style({ properties: Style.All}),
      }
    }),
    groupB: Group({
      props: {
        className: Style({ properties: Style.All}),
      }
    })
  },
  server: true,
})