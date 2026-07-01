import { runtime } from "@/makeswift/runtime"
import { Style } from "@makeswift/runtime/controls"
import { lazy } from "react"

runtime.registerComponent(
  lazy(() => import('./useid-demo')),
  {
    type: 'Use Id Demo',
    label: 'Custom / Use Id Demo',
    props: {
      classNameA: Style(),
      classNameB: Style(),
    },
  },
)