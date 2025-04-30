import { Combobox } from '@makeswift/runtime/controls'

import { getFieldOptions } from '@/lib/contentful/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/ContentfulImage/ContentfulImage.makeswift'
import { AuthorImage } from './AuthorImage'

runtime.registerComponent(AuthorImage, {
  type: 'author-image',
  label: 'Contentful/Author/Author Image',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'Author',
          filter: name => name === 'Asset',
          query,
        })
      },
    }),
  },
})
