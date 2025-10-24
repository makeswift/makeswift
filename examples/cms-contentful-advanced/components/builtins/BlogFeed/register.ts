import { Slot } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { BlogFeed } from './client'

export const COMPONENT_TYPE = 'blog-feed'

runtime.registerComponent(BlogFeed, {
  type: COMPONENT_TYPE,
  label: 'Blog Feed',
  props: {
    content: Slot(),
  },
  hidden: true,
})
