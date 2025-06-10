import { Slot } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { BlogPost } from './client'

export const COMPONENT_TYPE = 'blog-post'

runtime.registerComponent(BlogPost, {
  type: COMPONENT_TYPE,
  label: 'Blog Post',
  props: {
    content: Slot(),
  },
  hidden: true,
})
