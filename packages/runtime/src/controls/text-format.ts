import { type DeserializedRecord, unstable_TypographyDefinition } from '@makeswift/controls'

const TYPE = 'makeswift::controls::unstable-text-format'

/**
 * A typography control for the text formats only: bold, italic, underline,
 * and strikethrough. The data is the typography data, so the typography
 * plugin logic works for it. The builder shows a format bar for this type,
 * not the full typography panel.
 */
export class unstable_TextFormatDefinition extends unstable_TypographyDefinition {
  // `any`: the base class types `type` as the typography literal.
  static readonly type: any = TYPE

  static deserialize(data: DeserializedRecord): unstable_TextFormatDefinition {
    if (data.type !== TYPE) {
      throw new Error(`TextFormat: expected type ${TYPE}, got ${data.type}`)
    }

    return new unstable_TextFormatDefinition()
  }

  get controlType(): any {
    return TYPE
  }
}

export function unstable_TextFormat(): unstable_TextFormatDefinition {
  return new unstable_TextFormatDefinition()
}
