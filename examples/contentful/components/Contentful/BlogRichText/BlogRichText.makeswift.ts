import { Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import { BlogRichText } from './BlogRichText'

runtime.registerComponent(BlogRichText, {
  type: 'BlogRichText',
  label: 'Blog/Rich Text',
  props: {
    className: Style(),
  },
})
