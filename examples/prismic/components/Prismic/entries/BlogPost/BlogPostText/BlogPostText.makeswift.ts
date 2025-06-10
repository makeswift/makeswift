import { Combobox } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'
import { getFieldOptions } from '@/lib/prismic/utils'

import { props } from '../../../common/PrismicText/PrismicText.makeswift'
import { BlogPostText } from './BlogPostText'

runtime.registerComponent(BlogPostText, {
  type: 'blog-post-text',
  label: 'Prismic/Blog/Blog Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'Blogpost',
          filter: name => name === 'String',
          query,
        })
      },
    }),
  },
})
