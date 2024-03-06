import dynamic from 'next/dynamic';

import { List, Image, Shape, Style, TextInput, Link } from '@makeswift/runtime/controls';
import { forwardNextDynamicRef } from '@makeswift/runtime/next';

import { runtime } from '~/lib/makeswift/runtime';

export const props = {
  className: Style(),
  title: TextInput({ label: 'Heading text', defaultValue: 'Heading text', selectAll: true }),
  products: List({
    type: Shape({
      type: {
        label: TextInput({ label: 'Label', defaultValue: 'Label', selectAll: true }),
        image: Image({
          label: 'Image',
          format: Image.Format.WithDimensions,
        }),
        imageAlt: TextInput({
          label: 'Image alt text',
          defaultValue: 'Image',
          selectAll: true,
        }),
        link: Link(),
        buttonText: TextInput({
          label: 'Button text',
          defaultValue: 'Button text',
          selectAll: true,
        }),
      },
    }),
    getItemLabel(product) {
      return product?.label || 'Product';
    },
  }),
};

runtime.registerComponent(
  forwardNextDynamicRef((patch) =>
    dynamic(() => patch(import('./carousel-static').then(({ CarouselStatic }) => CarouselStatic))),
  ),
  { type: 'CarouselStatic', label: 'Carousel Static', icon: 'carousel', props },
);
