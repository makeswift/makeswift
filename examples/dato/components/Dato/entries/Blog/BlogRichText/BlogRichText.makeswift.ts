import { Combobox } from '@makeswift/runtime/controls'

import { props } from '@/components/Dato/common/DatoRichText/DatoRichText.makeswift'
import { getFieldOptions } from '@/lib/dato/utils'
import { runtime } from '@/lib/makeswift/runtime'

import { BlogRichText } from './BlogRichText'

runtime.registerComponent(BlogRichText, {
  type: 'BlogRichText',
  label: 'Blog/Blog Rich Text',
  props: {
    ...props,
    fieldPath: Combobox({
      label: 'Field name',
      async getOptions(query) {
        // This will fetch a filtered list of the fields with the type 'BlogModelBodyField' under the 'BlogRecord' type, allowing you to select the field you want to render.
        return await getFieldOptions({
          type: 'BlogRecord',
          filter: name => name === 'BlogModelBodyField',
          query,
        })
      },
    }),
  },
})
