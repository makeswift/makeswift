import {
  Color,
  Combobox,
  List,
  Style,
  Number,
} from "@makeswift/runtime/controls"
import { ReactRuntime } from "@makeswift/runtime/react"

import { Globe } from "../../components/Globe"

type Option = {
  id: string
  label: string
  value: { lat: number; lng: number; label: string }
}

type SearchResults = Option[]

// @ts-ignore getOptions types aren't correctly applying
ReactRuntime.registerComponent(Globe, {
  type: "globe",
  label: "Globe",
  props: {
    className: Style(),
    locations: List({
      label: "Locations",
      type: Combobox({
        label: "Address",
        getOptions(query: string) {
          return fetch(`/api/search?q=${query}`).then((r) => r.json())
        },
      }),
      getItemLabel(item) {
        return item?.label ?? "No address"
      },
    }),
    locationsColor: Color({ label: "Location color", defaultValue: "#FFFFFF" }),
    locationsOffset: Number({ label: "Location offset", defaultValue: 10 }),
    sphereColor: Color({ label: "Sphere color", defaultValue: "#000000" }),
    sphereOpacity: Number({
      label: "Sphere opacity",
      defaultValue: 0.7,
      min: 0,
      max: 1,
      step: 0.1,
    }),
    dotsColor: Color({ label: "Dot color", defaultValue: "#FFFFFF" }),
    dotCount: Number({ label: "Dot count", defaultValue: 20000, step: 5000 }),
    dotRadius: Number({ label: "Dot radius", defaultValue: 6.2, step: 0.1 }),
    dotsOffset: Number({ label: "Dot offset", defaultValue: 2 }),
    rotateSpeed: Number({
      label: "Rotate speed",
      defaultValue: 0.5,
      step: 0.1,
      min: 0,
    }),
  },
})
