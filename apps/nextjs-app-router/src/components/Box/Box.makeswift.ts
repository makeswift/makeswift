import { Style } from "@makeswift/runtime/controls";

import { runtime } from "@/makeswift/runtime";

import { Box } from "./Box";

runtime.registerComponent(Box, {
  type: 'MegaTestBox',
  label: 'Custom / TestBox',
  icon: 'cube',
  hidden: false,
  description: "A simple box component for testing purposes.",
  props: {
    className: Style({ properties: Style.All }),
  },
});