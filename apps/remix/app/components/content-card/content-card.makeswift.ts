/**
 * Makeswift registration for ContentCard component
 */
import { ReactRuntime } from '@makeswift/runtime/react'
import { 
  Color, 
  Image, 
  Number, 
  Select, 
  TextArea,
  TextInput 
} from '@makeswift/runtime/controls'
import { ContentCard, type ContentCardProps } from './content-card'
import { runtime } from '~/makeswift/runtime'

// Register the component with Makeswift
runtime.registerComponent(ContentCard, {
  type: 'content-card',
  label: 'Content Card',
  props: {
    title: TextInput({
      label: 'Title',
      defaultValue: 'Card Title',
    }),
    description: TextArea({
      label: 'Description',
      defaultValue: 'Card description goes here. Add details about this card.',
    }),
    imageUrl: Image({
      label: 'Image',
      format: 'url',
    }),
    backgroundColor: Color({
      label: 'Background Color',
      defaultValue: '#ffffff',
    }),
    borderRadius: Number({
      label: 'Border Radius',
      defaultValue: 8,
      min: 0,
      max: 50,
      step: 1,
    }),
    padding: Number({
      label: 'Padding',
      defaultValue: 20,
      min: 0,
      max: 100,
      step: 5,
    }),
    textAlign: Select({
      label: 'Text Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'left',
    }),
  },
})