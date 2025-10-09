import { Combobox } from '@makeswift/runtime/controls'

import { fetchFieldOptions } from '@/lib/dato/fieldOptions'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/DatoImage/DatoImage.makeswift'
import { BlogPostImage } from './BlogPostImage'

runtime.registerComponent(BlogPostImage, {
  type: 'blog-post-image',
  label: 'Dato/Blog/Blog Image',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return fetchFieldOptions({
          contentType: 'BlogpostRecord',
          fieldType: 'FileField',
          query,
        })
      },
    }),
  },
})
