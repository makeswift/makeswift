import { Checkbox, Group, Image, Link, List, Number, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { MakeswiftFooter } from './client'

export const COMPONENT_TYPE = 'makeswift-footer'

const logo = Group({
  label: 'Logo',
  preferredLayout: Group.Layout.Popover,
  props: {
    show: Checkbox({ label: 'Show logo', defaultValue: true }),
    src: Image({ label: 'Logo' }),
    alt: TextInput({ label: 'Alt text', defaultValue: 'Logo alt' }),
    width: Number({ label: 'Max width', suffix: 'px', defaultValue: 200 }),
  },
})

const links = List({
  label: 'Links',
  type: Group({
    label: 'Link',
    props: {
      label: TextInput({ label: 'Text', defaultValue: 'Text' }),
      link: Link({ label: 'URL' }),
    },
  }),
  getItemLabel: item => item?.label ?? 'Text',
})

runtime.registerComponent(MakeswiftFooter, {
  type: COMPONENT_TYPE,
  label: 'Site Footer (embedded)',
  hidden: true,
  props: {
    logo,
    sections: List({
      label: 'Sections',
      type: Group({
        label: 'Section',
        props: {
          title: TextInput({ label: 'Title', defaultValue: 'Section' }),
          links,
        },
      }),
      getItemLabel: item => item?.title ?? 'Section',
    }),
    copyright: TextInput({ label: 'Copyright text' }),
  },
})
