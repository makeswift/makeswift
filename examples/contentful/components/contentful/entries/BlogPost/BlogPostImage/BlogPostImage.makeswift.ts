import { Combobox } from '@makeswift/runtime/controls'

import { fetchFieldOptions } from '@/lib/contentful/fieldOptions'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/ContentfulImage/ContentfulImage.makeswift'
import { BlogPostImage } from './BlogPostImage'

runtime.registerComponent(BlogPostImage, {
  type: 'blog-post-image',
  label: 'Contentful/Blog/Blog Image',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return fetchFieldOptions({
          contentType: 'BlogPost',
          fieldType: 'Asset',
          query,
        })
      },
    }),
  },
})
