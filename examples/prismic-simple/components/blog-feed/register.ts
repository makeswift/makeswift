import { Checkbox, Number, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { BlogFeed } from './client'

export const COMPONENT_TYPE = 'blog-feed'

runtime.registerComponent(BlogFeed, {
  label: 'Blog Feed',
  type: COMPONENT_TYPE,
  props: {
    className: Style(),
    itemsPerPage: Number({
      label: 'Items per page',
      defaultValue: 6,
      min: 1,
      max: 100,
      step: 1,
    }),
    showPagination: Checkbox({
      label: 'Show pagination',
      defaultValue: true,
    }),
  },
})
