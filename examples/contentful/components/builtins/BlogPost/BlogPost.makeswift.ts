import { Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import BlogPost from './BlogPost'

export const BLOG_POST_EMBEDDED_COMPONENT_ID = 'blog-post-component' //unique id for the registered component

runtime.registerComponent(BlogPost, {
  type: BLOG_POST_EMBEDDED_COMPONENT_ID,
  label: 'Blog Container',
  props: {
    content: Slot(),
  },
  hidden: true,
})
