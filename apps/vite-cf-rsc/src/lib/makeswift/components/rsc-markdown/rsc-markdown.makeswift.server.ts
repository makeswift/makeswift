import { RscMarkdown, getMarkdownFileList } from './rsc-markdown'

import {
  Style,
  Combobox,
  Color,
  Link,
  Checkbox,
} from '@makeswift/runtime/controls'
import { runtime } from '../../runtime'

runtime.registerComponent(RscMarkdown, {
  type: 'rsc-markdown',
  label: 'Custom / RSC Markdown',
  props: {
    className: Style(),
    color: Color(),
    red: Checkbox({ label: 'Red', defaultValue: false }),
    link: Link(),
    filename: Combobox({
      label: 'Markdown File',
      getOptions: async (query: string) => {
        'use server'
        const files = getMarkdownFileList()
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
})
