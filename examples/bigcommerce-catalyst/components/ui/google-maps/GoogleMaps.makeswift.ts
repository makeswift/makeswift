import { Style } from "@makeswift/runtime/controls"
import { ReactRuntime } from "@makeswift/runtime/react"

import { GoogleMaps } from "./GoogleMaps"

ReactRuntime.registerComponent(GoogleMaps, {
  type: "google-maps",
  label: "Google Map",
  props: {
    className: Style(),
  },
})
