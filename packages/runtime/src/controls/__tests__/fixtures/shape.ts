import { TranslationDto } from '../../../state/react-page'
import { Shape, ShapeControlData } from '../../shape'
import { TextInput } from '../../text-input'
import { Link } from '../../link'
import { Number } from '../../number'

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
