import { runtime } from "@/makeswift/runtime"
import { Group, Style } from "@makeswift/runtime/controls"
import { ClientGroupNestedStyleTest } from "./client-group-nested-style-test"

runtime.registerComponent(ClientGroupNestedStyleTest, {
  type: 'client-group-nested-style-test',
  label: 'Custom / Client Group Nested Style Test',
  props: {
    groupA: Group({
      props: {
        classNameA: Style({ properties: Style.All}),
      }
    }),
    groupB: Group({
      props: {
        classNameB: Style({ properties: Style.All}),
      }
    })
  }
})