import { Combobox } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'
import { getFieldOptions } from '@/lib/prismic/utils'

import { props } from '../../../common/PrismicImage/PrismicImage.makeswift'
import { BlogPostImage } from './BlogPostImage'

runtime.registerComponent(BlogPostImage, {
  type: 'blog-post-image',
  label: 'Prismic/Blog/Blog Image',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'Blogpost',
          filter: ['hero'],
          query,
        })
      },
    }),
  },
})
