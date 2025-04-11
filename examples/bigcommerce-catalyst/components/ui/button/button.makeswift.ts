import { runtime } from '~/lib/makeswift/runtime';
import { MakeswiftComponentType } from '@makeswift/runtime';
import { Link, Select, Style, TextInput } from '@makeswift/runtime/controls';
import dynamic from 'next/dynamic';

export const props = {
  className: Style({ properties: [Style.Margin] }),
  link: Link(),
  children: TextInput({ label: 'Button text', defaultValue: 'Button text', selectAll: true }),
  variant: Select({
    label: 'Variant',
    options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Subtle', value: 'subtle' },
    ],
    defaultValue: 'primary',
  }),
};

runtime.registerComponent(
    dynamic(() => import('./button')),
  { type: MakeswiftComponentType.Button, label: 'Button', props },
);
