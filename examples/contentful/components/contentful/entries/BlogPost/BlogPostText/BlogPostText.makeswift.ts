import { Combobox } from '@makeswift/runtime/controls'

import { fetchFieldOptions } from '@/lib/contentful/fieldOptions'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/ContentfulText/ContentfulText.makeswift'
import { BlogPostText } from './BlogPostText'

runtime.registerComponent(BlogPostText, {
  type: 'blog-post-text',
  label: 'Contentful/Blog/Blog Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return fetchFieldOptions({
          contentType: 'BlogPost',
          fieldType: 'String',
          query,
        })
      },
    }),
  },
})
