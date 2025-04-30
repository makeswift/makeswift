import { Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import Author from './Author'

export const AUTHOR_EMBEDDED_COMPONENT_ID = 'author-page' //unique id for the registered component

runtime.registerComponent(Author, {
  type: AUTHOR_EMBEDDED_COMPONENT_ID,
  label: 'Author Container',
  props: {
    content: Slot(),
  },
  hidden: true,
})
