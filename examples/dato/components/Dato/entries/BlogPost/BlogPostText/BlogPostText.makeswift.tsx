import { Combobox } from '@makeswift/runtime/controls'

import { props } from '@/components/Dato/common/DatoText/DatoText.makeswift'
import { getFieldOptions } from '@/lib/dato/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { BlogPostText } from './BlogPostText'

runtime.registerComponent(BlogPostText, {
  type: 'blog-post-text',
  label: 'Dato/Blog/Blog Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'BlogpostRecord',
          filter: name => name === 'String',
          query,
        })
      },
    }),
  },
})
