import { Group, Image, Link, List, Number, Select, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { MakeswiftHeader } from './client'

export const COMPONENT_TYPE = 'makeswift-header'

const logo = Group({
  label: 'Logo',
  preferredLayout: Group.Layout.Popover,
  props: {
    src: Image({ label: 'Logo' }),
    alt: TextInput({ label: 'Alt text', defaultValue: 'Logo alt' }),
    width: Number({ label: 'Max width', suffix: 'px', defaultValue: 200 }),
  },
})

runtime.registerComponent(MakeswiftHeader, {
  type: COMPONENT_TYPE,
  label: 'Site Header (embedded)',
  hidden: true,
  props: {
    logo,
    links: List({
      label: 'Additional links',
      type: Group({
        label: 'Link',
        props: {
          label: TextInput({ label: 'Text', defaultValue: 'Text' }),
          link: Link({ label: 'URL' }),
        },
      }),
      getItemLabel: item => item?.label ?? 'Text',
    }),
    linksPosition: Select({
      label: 'Links position',
      options: [
        { value: 'center', label: 'Center' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      defaultValue: 'center',
    }),
  },
})
