export const ControlDataTypeKey = '@@makeswift/type'

// TODO: Unify tag serialization for controls that share the same underlying
// data type. For example, all plain-text controls should write the same tag
// (e.g. `text`). This requires refactoring `ControlDefinition` so prop editing
// remains backward-compatible when the host is running an older runtime.
const DataType = {
  Text: 'text',
  Number: 'number',
} as const

export const TextDataTypes = {
  textInput: 'text-input::v1',
  textArea: 'text-area::v1',
  code: 'code::v1',
} as const

const PropControllerTextDataTypes = [
  'prop-controllers::text-input::v1',
  'prop-controllers::text-area::v1',
] as const

export const AcceptedTextDataTypes = [
  DataType.Text,
  TextDataTypes.textInput,
  TextDataTypes.textArea,
  TextDataTypes.code,
  ...PropControllerTextDataTypes,
] as const

export const NumberDataTypes = { number: 'number::v1' } as const

const PropControllerNumberDataTypes = ['prop-controllers::number::v1'] as const

export const AcceptedNumberDataTypes = [
  DataType.Number,
  NumberDataTypes.number,
  ...PropControllerNumberDataTypes,
] as const

export const DateDataTypes = { date: 'date::v1' } as const

const PropControllerDateDataTypes = ['prop-controllers::date::v1'] as const

export const AcceptedDateDataTypes = [
  DateDataTypes.date,
  ...PropControllerDateDataTypes,
] as const
