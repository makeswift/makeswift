import { lazy } from 'react'
import { runtime } from '@/makeswift/runtime'

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
  Slider,
} from '@makeswift/runtime/controls'

runtime.registerComponent(
  lazy(() => import('./client').then((mod) => ({ default: mod.KitchenSink }))),
  {
    type: 'kitchen-sink',
    label: 'Custom / Kitchen Sink',
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
    },
  },
)
