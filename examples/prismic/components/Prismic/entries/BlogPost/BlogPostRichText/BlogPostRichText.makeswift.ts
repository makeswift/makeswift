import dynamic from 'next/dynamic'

import { Combobox } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'
import { getFieldOptions } from '@/lib/prismic/utils'

import { props } from '../../../common/PrismicRichText/PrismicRichText.makeswift'
import { BlogPostRichText } from './BlogPostRichText'

runtime.registerComponent(BlogPostRichText, {
  type: 'blog-post-rich-text',
  label: 'Prismic/Blog/Blog Rich Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'Blogpost',
          filter: ['body'],
          query,
        })
      },
    }),
  },
})
