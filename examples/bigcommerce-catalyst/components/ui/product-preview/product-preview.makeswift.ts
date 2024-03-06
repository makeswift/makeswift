import { runtime } from '~/lib/makeswift/runtime';
import { Image, Link, Style, TextInput } from '@makeswift/runtime/controls';

import { forwardNextDynamicRef } from '@makeswift/runtime/next';
import dynamic from 'next/dynamic';

export const props = {
  className: Style(),
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
  buttonText: TextInput({ label: 'Button text', defaultValue: 'Button text', selectAll: true }),
};

runtime.registerComponent(
  forwardNextDynamicRef((patch) =>
    dynamic(() => patch(import('./product-preview').then(({ ProductPreview }) => ProductPreview))),
  ),
  { type: 'product-preview', label: 'Product Preview', props },
);
