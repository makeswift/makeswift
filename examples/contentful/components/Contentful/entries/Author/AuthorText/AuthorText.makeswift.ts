import { Combobox } from '@makeswift/runtime/controls'

import { getFieldOptions } from '@/lib/contentful/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/ContentfulText/ContentfulText.makeswift'
import { AuthorText } from './AuthorText'

runtime.registerComponent(AuthorText, {
  type: 'author-text',
  label: 'Contentful/Author/Author Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'Author',
          filter: name => name === 'String',
          query,
        })
      },
    }),
  },
})
