export const ControlDataTypeKey = '@@makeswift/type'

export const DataType = {
  Text: 'text',
  Number: 'number',
} as const

const LegacyTextDataTypes = ['text-input::v1', 'text-area::v1'] as const

const LegacyPropControllerTextDataTypes = [
  'prop-controllers::text-input::v1',
  'prop-controllers::text-area::v1',
] as const

export const AcceptedTextDataTypes = [
  DataType.Text,
  ...LegacyTextDataTypes,
  ...LegacyPropControllerTextDataTypes,
] as const

const LegacyNumberDataTypes = ['number::v1'] as const

const LegacyPropControllerNumberDataTypes = [
  'prop-controllers::number::v1',
] as const

export const AcceptedNumberDataTypes = [
  DataType.Number,
  ...LegacyNumberDataTypes,
  ...LegacyPropControllerNumberDataTypes,
] as const
