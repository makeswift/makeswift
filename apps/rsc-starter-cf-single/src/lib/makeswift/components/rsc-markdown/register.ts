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
  List,
} from '@makeswift/runtime/controls'

export const registerRscMarkdownComponent = (runtime: ReactRuntime) =>
  runtime.registerComponent(
    lazy(() =>
      import('./server').then((mod) => ({ default: mod.RscMarkdown })),
    ),
    {
      type: 'rsc-markdown',
      label: 'Custom / RSC Markdown',
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
