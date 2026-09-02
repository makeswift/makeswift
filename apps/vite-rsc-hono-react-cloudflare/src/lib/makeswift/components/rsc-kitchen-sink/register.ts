import { ReactRuntime, serverOnly } from '@makeswift/vite-rsc'

import {
  Checkbox,
  Color,
  Combobox,
  Group,
  Link,
  List,
  Number,
  RichText,
  Slider,
  Slot,
  Style,
  TextInput,
} from '@makeswift/runtime/controls'

export const registerRscMarkdownComponent = (runtime: ReactRuntime) =>
  runtime.registerComponent(
    serverOnly(() =>
      import('./server').then((mod) => ({ default: mod.RscKitchenSink })),
    ),
    {
      type: 'rsc-kitchen-sink',
      label: 'Custom / RSC Kitchen Sink',
      props: {
        className: Style(),
        number: Number({
          label: 'Number',
          defaultValue: 0,
          min: 0,
          max: 100,
          step: 1,
        }),
        bgColor: Color({ label: 'Bg color' }),
        red: Checkbox({ label: 'Red', defaultValue: false }),
        link: Link({ label: 'Link' }),
        listOfLinks: List({
          label: 'List of links',
          type: Link(),
        }),
        richText: RichText(),
        slot: Slot(),
        group: Group({
          label: 'Group',
          preferredLayout: Group.Layout.Popover,
          props: {
            bgColor: Color({ label: 'Bg color' }),
            groupSlot: Slot(),
            groupRichText: RichText(),
            slotGroups: List({
              label: "Group's list of groups",
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
        listOfRichTexts: List({
          label: 'List of rich texts',
          type: RichText(),
        }),
        listOfGroups: List({
          label: 'List of groups',
          type: Group({
            props: {
              name: TextInput({
                label: 'Name',
                defaultValue: 'untitled group',
              }),
              bgColor: Color({ label: 'Bg color' }),
              slot: Slot(),
              richText: RichText(),
              combobox: Combobox({
                label: 'TV Show',
                async getOptions(query) {
                  const search = new URLSearchParams({ q: query })
                  const res = await fetch(
                    `https://api.tvmaze.com/search/shows?${search}`,
                  )

                  if (!res.ok) return []

                  const body = (await res.json()) as any[]
                  return body.map(({ show }) => ({
                    id: `${show.id}`,
                    label: show.name,
                    value: show.url,
                  }))
                },
              }),

              number: Slider({
                label: 'Number',
                defaultValue: 0,
                min: 0,
                max: 100,
                step: 1,
              }),
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
      },
      server: true,
    },
  )
