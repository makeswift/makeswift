import dynamic from 'next/dynamic'

import { Combobox } from '@makeswift/runtime/controls'

import { getFieldOptions } from '@/lib/contentful/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { props } from '../../../common/ContentfulRichText/ContentfulRichText.makeswift'
import { AuthorRichText } from './AuthorRichText'

runtime.registerComponent(AuthorRichText, {
  type: 'author-rich-text',
  label: 'Contentful/Author/Author Rich Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field',
      async getOptions(query) {
        return getFieldOptions({
          type: 'Author',
          filter: name => name === 'RichText',
          query,
        })
      },
    }),
  },
})
