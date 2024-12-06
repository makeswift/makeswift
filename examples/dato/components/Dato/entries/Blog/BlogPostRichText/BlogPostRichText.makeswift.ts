import { Combobox } from '@makeswift/runtime/controls'

import { props } from '@/components/Dato/common/DatoRichText/DatoRichText.makeswift'
import { getFieldOptions } from '@/lib/dato/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { BlogPostRichText } from './BlogPostRichText'

runtime.registerComponent(BlogPostRichText, {
  type: 'BlogPostRichText',
  label: 'Blog/BlogPost/BlogPostRichText',
  props: {
    ...props,
    fieldPath: Combobox({
      async getOptions(query) {
        const a = await getFieldOptions({
          type: 'BlogRecord',
          filter: name => name === 'BlogModelBodyField',
          query,
        })
        console.log({ a })
        return a
      },
    }),
  },
})
