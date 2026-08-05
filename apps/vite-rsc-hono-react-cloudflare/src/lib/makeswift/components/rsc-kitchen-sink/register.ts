import { lazy } from 'react'
import { ReactRuntime } from '@makeswift/hono-react'

import {
  Style,
  Combobox,
  Color,
  Link,
  Checkbox,
  Number,
  RichText,
  Slot,
  Group,
  List,
  TextInput,
} from '@makeswift/runtime/controls'

export const registerRscMarkdownComponent = (runtime: ReactRuntime) =>
  runtime.registerComponent(
    lazy(() =>
      import('./server').then((mod) => ({ default: mod.RscKitchenSink })),
    ),
    {
      type: 'rsc-kitchen-sink',
      label: 'Custom / RSC Kitchen Sink',
      props: {
        className: Style(),
        color: Color(),
        red: Checkbox({ label: 'Red', defaultValue: false }),
        link: Link(),
        // richText: RichText(),
        slot: Slot(),
        list: List({
          label: 'Items',
          type: Link(),
        }),
        group: Group({
          label: 'Group',
          props: {
            color: Color({ label: 'Bg color' }),
            groupSlot: Slot(),
            slotGroups: List({
              label: 'List of groups',
              type: Group({
                props: {
                  slot: Slot(),
                },
              }),
            }),
          },
        }),
        listOfSlots: List({
          label: 'List of slots',
          type: Slot(),
        }),
        listOfGroups: List({
          label: 'List of groups',
          type: Group({
            props: {
              name: TextInput({
                label: 'Name',
                defaultValue: 'untitled group',
              }),
              slot: Slot(),
            },
          }),
          getItemLabel: (item) => item?.name ?? 'untitled group',
        }),
        showMarkdown: Checkbox({ label: 'Show markdown', defaultValue: true }),
        filename: Combobox({
          label: 'Markdown File',
          getOptions: async (query: string) => {
            'use server'
            const { getMarkdownFileList } = await import('./actions')
            const files = await getMarkdownFileList()
            return files
              .filter((f) => f.toLowerCase().includes(query.toLowerCase()))
              .map((f) => ({
                id: f,
                label: f.split('/').pop() ?? f,
                value: f,
              }))
          },
        }),
        number: Number({
          label: 'Number',
          defaultValue: 0,
          min: 0,
          max: 100,
          step: 1,
        }),
      },
      server: true,
    },
  )
