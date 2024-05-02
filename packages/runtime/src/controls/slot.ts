import { z } from 'zod'
import { PropController } from '../prop-controllers/base'
import { BoxModel } from '../state/modules/box-models'
import {
  CopyContext,
  isElementReference,
  MergeContext,
  MergeTranslatableDataContext,
} from '../state/react-page'
import { deletableElementSchema, Element } from './data'
import { createResponsiveValueSchema } from '@makeswift/prop-controllers'
import { ControlDataTypeKey } from './control-data-type-key'
import { match, P } from 'ts-pattern'

const slotControlColumnDataSchema = z.object({
  count: z.number(),
  spans: z.array(z.array(z.number())),
})

const slotDataSchema = z.object({
  elements: z.array(deletableElementSchema),
  columns: createResponsiveValueSchema(slotControlColumnDataSchema),
})

export type SlotData = z.infer<typeof slotDataSchema>

export const SlotControlType = 'makeswift::controls::slot'

const slotControlDataV0Schema = slotDataSchema

export type SlotControlDataV0 = z.infer<typeof slotControlDataV0Schema>

export const slotControlDataV1Type = 'makeswift::slot::v1'

const slotControlDataV1Schema = z.object({
  [ControlDataTypeKey]: z.literal(slotControlDataV1Type),
  value: slotDataSchema,
})

export type SlotControlDataV1 = z.infer<typeof slotControlDataV1Schema>

export const slotControlDataSchema = z.union([slotControlDataV0Schema, slotControlDataV1Schema])

export type SlotControlData = z.infer<typeof slotControlDataSchema>

type SlotControlDefinitionV0<_T = SlotControlDataV0> = {
  type: typeof SlotControlType
}

type SlotControlDefinitionV1<_T = SlotControlData> = {
  type: typeof SlotControlType
  version: 1
}

export type SlotControlDefinition<_T = SlotControlData> =
  | SlotControlDefinitionV0
  | SlotControlDefinitionV1

export type ResolveSlotControlValue<T extends SlotControlDefinition> =
  T extends SlotControlDefinition ? SlotData | undefined : never

export function Slot(): SlotControlDefinition {
  return {
    type: SlotControlType,
    version: 1,
  }
}

// ------------------------------
export const SlotControlMessageType = {
  CONTAINER_BOX_MODEL_CHANGE: 'makeswift::controls::slot::message::container-box-model-change',
  ITEM_BOX_MODEL_CHANGE: 'makeswift::controls::slot::message::item-box-model-change',
} as const

type SlotControlContainerBoxModelChangeMessage = {
  type: typeof SlotControlMessageType.CONTAINER_BOX_MODEL_CHANGE
  payload: { boxModel: BoxModel | null }
}

type SlotControlItemBoxModelChangeMessage = {
  type: typeof SlotControlMessageType.ITEM_BOX_MODEL_CHANGE
  payload: { index: number; boxModel: BoxModel | null }
}

export type SlotControlMessage =
  | SlotControlContainerBoxModelChangeMessage
  | SlotControlItemBoxModelChangeMessage

export class SlotControl extends PropController<SlotControlMessage> {
  recv = () => {}

  changeContainerBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: SlotControlMessageType.CONTAINER_BOX_MODEL_CHANGE, payload: { boxModel } })
  }

  changeItemBoxModel(index: number, boxModel: BoxModel | null): void {
    this.send({ type: SlotControlMessageType.ITEM_BOX_MODEL_CHANGE, payload: { index, boxModel } })
  }
}

export function getSlotControlDataSlotData(
  data: SlotControlData | undefined,
): SlotData | undefined {
  return match(data)
    .with({ [ControlDataTypeKey]: slotControlDataV1Type }, v1 => v1.value)
    .otherwise(v0 => v0)
}

export function createSlotControlDataFromSlotData(
  value: SlotData,
  definition: SlotControlDefinition,
): SlotControlData {
  return match(definition)
    .with(
      { version: 1 },
      P.nullish,
      () =>
        ({
          [ControlDataTypeKey]: slotControlDataV1Type,
          value,
        } as const),
    )
    .otherwise(() => value)
}

function copySlotData(value: SlotData, context: CopyContext): SlotData {
  if (value == null) return value

  return {
    ...value,
    elements: value.elements.map(element => context.copyElement(element)),
  }
}

export function copySlotControlData(
  data: SlotControlData | undefined,
  context: CopyContext,
): SlotControlData | undefined {
  return match(data)
    .with(undefined, () => undefined)
    .with(
      { [ControlDataTypeKey]: slotControlDataV1Type },
      v1 =>
        ({
          [ControlDataTypeKey]: slotControlDataV1Type,
          value: copySlotData(v1.value, context),
        } as const),
    )
    .otherwise(v0 => copySlotData(v0, context))
}

/**
 * @todo
 * - Inserting elements
 * - Moving elements
 * - Merging column data
 */
export function mergeSlotData(
  base: SlotData | undefined = { columns: [], elements: [] },
  override: SlotData | undefined = { columns: [], elements: [] },
  context: MergeContext,
): SlotData {
  const mergedColumns = base.columns
  const mergedElements = base.elements.flatMap(baseElement => {
    const overrideElement = override.elements.find(
      e => baseElement.type === e.type && baseElement.key === e.key,
    )

    if (overrideElement == null) return [baseElement]

    if (overrideElement.deleted) return []

    if (isElementReference(overrideElement)) return [overrideElement]

    if (isElementReference(baseElement)) return [baseElement]

    return context.mergeElement(baseElement, overrideElement)
  })

  return { columns: mergedColumns, elements: mergedElements }
}

export function mergeSlotControlData(
  definition: SlotControlDefinition,
  _base: SlotControlData | undefined,
  _override: SlotControlData | undefined,
  context: MergeContext,
): SlotControlData {
  const defaultValue = createSlotControlDataFromSlotData({ columns: [], elements: [] }, definition)
  const base = _base ?? defaultValue
  const override = _override ?? defaultValue
  const overrideValue = getSlotControlDataSlotData(override)

  return match(base)
    .with(
      { [ControlDataTypeKey]: slotControlDataV1Type },
      v1 =>
        ({
          [ControlDataTypeKey]: slotControlDataV1Type,
          value: mergeSlotData(v1.value, overrideValue, context),
        } as const),
    )
    .otherwise(v0 => mergeSlotData(v0, overrideValue, context))
}

function mergeSlotDataTranslatedData(
  data: SlotData,
  context: MergeTranslatableDataContext,
): SlotData {
  return {
    ...data,
    elements: data.elements.map(element => context.mergeTranslatedData(element)),
  }
}

export function mergeSlotControlTranslatedData(
  data: SlotControlData,
  context: MergeTranslatableDataContext,
): SlotControlData {
  return match(data)
    .with(
      { [ControlDataTypeKey]: slotControlDataV1Type },
      v1 =>
        ({
          [ControlDataTypeKey]: slotControlDataV1Type,
          value: mergeSlotDataTranslatedData(v1.value, context),
        } as const),
    )
    .otherwise(v0 => mergeSlotDataTranslatedData(v0, context))
}

export function getSlotControlElementChildren(data: SlotControlData | undefined): Element[] {
  return getSlotControlDataSlotData(data)?.elements ?? []
}

type Path = ReadonlyArray<string | number>

export function getSlotControlGetElementPath(
  data: SlotControlData | undefined,
  elementKey: string,
): Path | null {
  const value = getSlotControlDataSlotData(data)

  const idx = value?.elements.findIndex(element => element.key === elementKey) ?? -1

  if (idx === -1) return null

  return match(data)
    .with({ [ControlDataTypeKey]: slotControlDataV1Type }, _v1 => ['value', 'elements', idx])
    .otherwise(_v0 => ['elements', idx])
}
