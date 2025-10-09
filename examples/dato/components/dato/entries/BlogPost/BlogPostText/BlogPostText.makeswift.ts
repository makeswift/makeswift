import { Combobox } from '@makeswift/runtime/controls'

import { fetchFieldOptions } from '@/lib/dato/fieldOptions'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/DatoText/DatoText.makeswift'
import { BlogPostText } from './BlogPostText'

runtime.registerComponent(BlogPostText, {
  type: 'blog-post-text',
  label: 'Dato/Blog/Blog Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return fetchFieldOptions({
          contentType: 'BlogpostRecord',
          fieldType: 'String',
          query,
        })
      },
    }),
  },
})
