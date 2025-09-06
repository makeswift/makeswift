import { List, TextInput, type DataType, type TranslationDto } from '@makeswift/controls'

export const componentRegistration = List({
  type: TextInput(),
})

type Data = DataType<typeof componentRegistration>

export const translatableComponentData: Data = [
  { id: 'id-1' },
  {
    id: 'id-2',
    value: {
      '@@makeswift/type': 'text-input::v1',
      value: 'Hello',
    },
  },
  { id: 'id-3' },
]

export const translatedComponentData: Data = [
  { id: 'id-1' },
  {
    id: 'id-2',
    value: {
      '@@makeswift/type': 'text-input::v1',
      value: 'Bonjour',
    },
  },
  { id: 'id-3' },
]

export const translatedData: TranslationDto = {
  'id-2': {
    '@@makeswift/type': 'text-input::v1',
    value: 'Bonjour',
  },
}
