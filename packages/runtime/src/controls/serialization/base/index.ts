import {
  ControlDefinition,
  type SerializedRecord,
  type DeserializedRecord,
  ShapeV2Definition,
  DeserializationPlugin,
  deserializeRecord,
} from '@makeswift/controls'

import {
  CheckboxDefinition,
  ColorDefinition,
  ComboboxDefinition,
  FontDefinition,
  GroupDefinition,
  IconRadioGroupDefinition,
  ImageDefinition,
  LinkDefinition,
  ListDefinition,
  NumberDefinition,
  RichTextV1Definition,
  RichTextV2Definition,
  SelectDefinition,
  ShapeDefinition,
  SlotDefinition,
  StyleDefinition,
  StyleV2Definition,
  TextAreaDefinition,
  TextInputDefinition,
  unstable_TypographyDefinition,
} from '../../index'

import { BaseControlSerializationVisitor } from './visitor'

export { type SerializedRecord, type DeserializedRecord } from '@makeswift/controls'

export function serializeControls(
  controls: Record<string, ControlDefinition>,
  visitor: BaseControlSerializationVisitor,
): Record<string, SerializedRecord> {
  return Object.entries(controls).reduce<Record<string, SerializedRecord>>(
    (acc, [key, control]) => {
      return { ...acc, [key]: control.accept(visitor) }
    },
    {},
  )
}

export type DeserializeControlOptions = {
  plugins: DeserializationPlugin<any>[]
}

export function deserializeControl(
  serializedControl: SerializedRecord,
  options: DeserializeControlOptions,
): ControlDefinition {
  const plugins = options?.plugins ?? []

  return deserializeUnifiedControlDef(deserializeRecord(serializedControl, plugins))
}

export function deserializeUnifiedControlDef(record: DeserializedRecord): ControlDefinition {
  type DeserializeMethod = (data: DeserializedRecord) => ControlDefinition
  const deserializeMethod: Record<string, DeserializeMethod> = {
    [CheckboxDefinition.type]: CheckboxDefinition.deserialize,
    [ColorDefinition.type]: ColorDefinition.deserialize,
    [ComboboxDefinition.type]: ComboboxDefinition.deserialize,
    [FontDefinition.type]: FontDefinition.deserialize,
    [GroupDefinition.type]: record =>
      GroupDefinition.deserialize(record, deserializeUnifiedControlDef),
    [IconRadioGroupDefinition.type]: IconRadioGroupDefinition.deserialize,
    [ImageDefinition.type]: ImageDefinition.deserialize,
    [LinkDefinition.type]: LinkDefinition.deserialize,
    [ListDefinition.type]: record =>
      ListDefinition.deserialize(record, deserializeUnifiedControlDef),
    [NumberDefinition.type]: NumberDefinition.deserialize,
    [RichTextV1Definition.type]: RichTextV1Definition.deserialize,
    [RichTextV2Definition.type]: record =>
      RichTextV2Definition.deserialize(record, deserializeUnifiedControlDef),
    [SelectDefinition.type]: SelectDefinition.deserialize,
    [ShapeDefinition.type]: record =>
      ShapeDefinition.deserialize(record, deserializeUnifiedControlDef),
    [ShapeV2Definition.type]: record =>
      ShapeV2Definition.deserialize(record, deserializeUnifiedControlDef),
    [SlotDefinition.type]: SlotDefinition.deserialize,
    [StyleDefinition.type]: StyleDefinition.deserialize,
    [StyleV2Definition.type]: record =>
      StyleV2Definition.deserialize(record, deserializeUnifiedControlDef),
    [TextAreaDefinition.type]: TextAreaDefinition.deserialize,
    [TextInputDefinition.type]: TextInputDefinition.deserialize,
    [unstable_TypographyDefinition.type]: unstable_TypographyDefinition.deserialize,
  } as const

  const deserialize = deserializeMethod[record.type] ?? null
  if (deserialize == null) {
    throw new Error(`Unknown control type: ${record.type}`)
  }

  return deserialize(record)
}
