/**
 * Makeswift registration for SimpleText component
 */
import { ReactRuntime } from '@makeswift/runtime/react'
import { Color, Style, TextInput } from '@makeswift/runtime/controls'
import { SimpleText, type SimpleTextProps } from './simple-text'
import { runtime } from '~/makeswift/runtime'

// Register the component with Makeswift
runtime.registerComponent(SimpleText, {
  type: 'simple-text',
  label: 'Simple Text',
  props: {
    text: TextInput({
      label: 'Text',
      defaultValue: 'Hello from Remix!',
    }),
    color: Color({
      label: 'Text Color',
      defaultValue: '#000000',
    }),
    fontSize: Style({
      properties: [
        {
          property: 'fontSize',
          label: 'Font Size',
          defaultValue: 16,
        }
      ]
    })
  },
})