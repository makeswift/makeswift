import { deserializeRecord } from '@makeswift/controls'

import { deserializeUnifiedControlDef } from '../../serialization/base'
import { ClientMessagePortSerializationVisitor } from '../../serialization/message-port/visitor'
import { functionDeserializationPlugin } from '../../serialization/message-port/function-serialization'

import { RichText, RichTextV2Definition } from '../rich-text-v2'

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
    const serializationVisitor = new ClientMessagePortSerializationVisitor()
    const serializedDefinition = def.accept(serializationVisitor)
    const transferables = serializationVisitor.getTransferables()
    expect(serializedDefinition).toMatchSnapshot('serialized definition')
    expect(transferables.length).toMatchSnapshot('transferables')
    transferables.forEach((port: any) => port.close())

    RichTextV2Definition.generateParagraph = jest.fn(() => 'generated paragraph')
    const deserializedDefinition = RichTextV2Definition.deserialize(
      deserializeRecord(serializedDefinition, [functionDeserializationPlugin]),
      deserializeUnifiedControlDef,
    )

    expect(deserializedDefinition).toMatchSnapshot()
  })
})
