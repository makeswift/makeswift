import { Link, Number, TextInput } from '@makeswift/controls'

import { TranslationDto } from '../../../state/react-page'
import { Shape, ShapeControlData } from '../../shape'

export const componentRegistration = Shape({
  type: {
    text: TextInput(),
    link: Link(),
    number: Number(),
  },
})

type Data = ShapeControlData<typeof componentRegistration>

export const translatableComponentData: Data = {
  text: 'Text',
  link: { type: 'OPEN_URL', payload: { openInNewTab: false, url: 'https://example.com' } },
  number: 10,
}

export const translatedComponentData: Data = {
  text: 'TextPrime',
  link: { type: 'OPEN_URL', payload: { openInNewTab: false, url: 'https://example.com' } },
  number: 10,
}

export const translatedData: TranslationDto = {
  text: 'TextPrime',
  link: { type: 'OPEN_URL', payload: { openInNewTab: false, url: 'https://example.com' } },
  number: 10,
}
