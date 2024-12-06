import { Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { BlogFeed } from './BlogFeed'

runtime.registerComponent(BlogFeed, {
  type: 'BlogFeed',
  label: 'Blog/Feed',
  props: {
    className: Style(),
  },
})
