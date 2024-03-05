import dynamic from 'next/dynamic';

import { searchAddress } from '@/lib/fetchers';
import { runtime } from '@/lib/makeswift/runtime';
import {
  Checkbox,
  Combobox,
  Image,
  Link,
  List,
  Number,
  Shape,
  Slot,
  Style,
  TextInput,
} from '@makeswift/runtime/controls';
import { forwardNextDynamicRef } from '@makeswift/runtime/next';

runtime.registerComponent(
  forwardNextDynamicRef((patch) =>
    dynamic(() => patch(import('./store-locator').then(({ CatalystMap }) => CatalystMap))),
  ),
  {
    type: 'googleMap',
    label: 'Locations Map',
    props: {
      className: Style(),
      children: Slot(),
      options: Shape({
        type: {
          center: Combobox({
            label: 'Center Address',
            async getOptions(query: string) {
              const results = await searchAddress(query);

              return results
                .map((result) => ({
                  id: result.id,
                  label: result.label,
                  value: result.value.position,
                }))
                .filter(Boolean);
            },
          }),
          zoom: Number({ label: 'Zoom Level', defaultValue: 5 }),
          streetViewControl: Checkbox({
            label: 'Street View Button',
            defaultValue: false,
          }),
          controlSize: Number({ label: 'Map Control Size', defaultValue: 24 }),
        },
      }),
    },
  },
);
