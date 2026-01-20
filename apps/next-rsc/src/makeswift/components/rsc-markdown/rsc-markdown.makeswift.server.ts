import { RscMarkdown } from './rsc-markdown'

import { Style, Combobox, Color, Link } from '@makeswift/runtime/controls'
import { readdir } from 'fs/promises'
import { runtime } from '@/makeswift/runtime'

runtime.registerComponent(RscMarkdown, {
  type: 'rsc-markdown',
  label: 'Custom / RSC Markdown',
  props: {
    className: Style(),
    color: Color(),
    link: Link(),
    filename: Combobox({
      label: 'Markdown File',
      getOptions: async (query: string) => {
        'use server'
        const files = await readdir(process.cwd(), { withFileTypes: true })
        return files
          .filter((f) => f.isFile() && f.name.endsWith('.md'))
          .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
          .map((f) => ({ id: f.name, label: f.name, value: f.name }))
      },
    }),
  },
  server: true,
})
