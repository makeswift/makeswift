import { Combobox } from '@makeswift/runtime/controls'

import { props } from '@/components/Dato/common/DatoRichText/DatoRichText.makeswift'
import { getFieldOptions } from '@/lib/dato/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { BlogPostRichText } from './BlogPostRichText'

runtime.registerComponent(BlogPostRichText, {
  type: 'blog-post-rich-text',
  label: 'Dato/Blog/Blog Rich Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'BlogpostRecord',
          filter: name => name === 'BlogpostModelBodyField',
          query,
        })
      },
    }),
  },
})
