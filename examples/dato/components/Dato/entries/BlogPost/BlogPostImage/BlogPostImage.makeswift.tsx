import { Combobox } from '@makeswift/runtime/controls'

import { props } from '@/components/Dato/common/DatoImage/DatoImage.makeswift'
import { getFieldOptions } from '@/lib/dato/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { BlogPostImage } from './BlogPostImage'

runtime.registerComponent(BlogPostImage, {
  type: 'blog-post-image',
  label: 'Dato/Blog/Blog Image',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'BlogpostRecord',
          filter: name => name === 'ResponsiveImage',
          query,
        })
      },
    }),
  },
})
