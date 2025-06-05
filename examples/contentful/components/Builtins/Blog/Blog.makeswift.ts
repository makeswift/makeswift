import { Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import Blog from './Blog'

export const BLOG_EMBEDDED_COMPONENT_ID = 'blog-component' //unique id for the registered component

runtime.registerComponent(Blog, {
  type: BLOG_EMBEDDED_COMPONENT_ID,
  label: 'Blog Container',
  props: {
    content: Slot(),
  },
  hidden: true,
})
