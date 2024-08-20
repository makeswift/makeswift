import { deserializeRecord } from '@makeswift/controls'
import { RichText, RichTextV2Definition } from '../rich-text-v2'
import { deserializeUnifiedControlDef } from '../../../builder/serialization/control-serialization'

jest.mock('corporate-ipsum', () => {
  return {
    __esModule: true,
    default: jest.fn(() => '[generated random text]'),
  }
})

expect.addSnapshotSerializer({
  serialize: () => '[MessagePort]',
  test: value => value instanceof MessagePort,
})

describe('RichTextV2 serialization', () => {
  test.each([
    ['block', RichText()],
    ['inline', RichText({ mode: RichText.Mode.Inline })],
  ])('deserialized definition in %s mode contains correct plugins', (_mode, def) => {
    const [serializedDefinition, transferables] = def.serialize()
    expect(serializedDefinition).toMatchSnapshot('serialized definition')
    expect(transferables.length).toMatchSnapshot('transferables')
    transferables.forEach((port: any) => port.close())

    RichTextV2Definition.generateParagraph = jest.fn(() => 'generated paragraph')
    const deserializedDefinition = RichTextV2Definition.deserialize(
      deserializeRecord(serializedDefinition),
      deserializeUnifiedControlDef,
    )

    expect(deserializedDefinition).toMatchSnapshot()
  })
})
