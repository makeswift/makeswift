import { runtime } from '~/lib/makeswift/runtime';
import { Image, Link, Style, TextInput } from '@makeswift/runtime/controls';
import { lazy } from 'react';

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
  lazy(() => import('./product-preview')),
  { type: 'product-preview', label: 'Product Preview', props },
);
