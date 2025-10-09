import { Combobox } from '@makeswift/runtime/controls'

import { fetchFieldOptions } from '@/lib/dato/fieldOptions'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/DatoRichText/DatoRichText.makeswift'
import { BlogPostRichText } from './BlogPostRichText'

runtime.registerComponent(BlogPostRichText, {
  type: 'blog-post-rich-text',
  label: 'Dato/Blog/Blog Rich Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return fetchFieldOptions({
          contentType: 'BlogpostRecord',
          fieldType: 'StructuredText',
          query,
        })
      },
    }),
  },
})
