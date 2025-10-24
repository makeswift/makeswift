import { Combobox } from '@makeswift/runtime/controls'

import { fetchFieldOptions } from '@/lib/contentful/fieldOptions'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/ContentfulRichText/ContentfulRichText.makeswift'
import { BlogPostRichText } from './BlogPostRichText'

runtime.registerComponent(BlogPostRichText, {
  type: 'blog-post-rich-text',
  label: 'Contentful/Blog/Blog Rich Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return fetchFieldOptions({
          contentType: 'BlogPost',
          fieldType: 'RichText',
          query,
        })
      },
    }),
  },
})
