import { Number, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { BlogPostFeed } from './BlogPostFeed'

runtime.registerComponent(BlogPostFeed, {
  type: 'BlogFeed',
  label: 'Dato/Blog/Feed',
  props: {
    className: Style(),
    itemsPerPage: Number({
      label: 'Items per page',
      defaultValue: 3,
      min: 1,
    }),
  },
})
