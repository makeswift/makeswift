import { PropController } from '../prop-controllers/base'
import { BoxModel } from '../state/modules/box-models'
import { CopyContext, Element } from '../state/react-page'
import { ResponsiveValue } from './types'

type SlotControlColumnData = { count: number; spans: number[][] }

export type SlotControlData = {
  elements: Element[]
  columns: ResponsiveValue<SlotControlColumnData>
}

export const SlotControlType = 'makeswift::controls::slot'

export type SlotControlDefinition = {
  type: typeof SlotControlType
}

export function Slot(): SlotControlDefinition {
  return { type: SlotControlType }
}

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

export function copySlotData(
  value: SlotControlData | undefined,
  context: CopyContext,
): SlotControlData | undefined {
  if (value == null) return value

  return {
    ...value,
    elements: value.elements.map(element => context.copyElement(element)),
  }
}
