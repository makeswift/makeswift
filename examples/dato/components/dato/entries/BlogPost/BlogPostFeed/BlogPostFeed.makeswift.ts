import { Checkbox, Number, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { BlogPostFeed } from './BlogPostFeed'

runtime.registerComponent(BlogPostFeed, {
  type: 'BlogPostFeed',
  label: 'Dato/Blog/Feed',
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
