import { type BoxModel } from '../../common'

import { ControlInstance } from '../instance'

type BoxModelChangeMessage = {
  type: typeof SlotControl.CONTAINER_BOX_MODEL_CHANGE
  payload: { boxModel: BoxModel | null }
}

type ItemBoxModelChangeMessage = {
  type: typeof SlotControl.ITEM_BOX_MODEL_CHANGE
  payload: { index: number; boxModel: BoxModel | null }
}

type Message = BoxModelChangeMessage | ItemBoxModelChangeMessage

export class SlotControl extends ControlInstance<Message> {
  static readonly CONTAINER_BOX_MODEL_CHANGE =
    'makeswift::controls::slot::message::container-box-model-change'

  static readonly ITEM_BOX_MODEL_CHANGE =
    'makeswift::controls::slot::message::item-box-model-change'

  recv = (_message: Message) => {}
  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  changeContainerBoxModel(boxModel: BoxModel | null): void {
    this.sendMessage({
      type: SlotControl.CONTAINER_BOX_MODEL_CHANGE,
      payload: { boxModel },
    })
  }

  changeItemBoxModel(index: number, boxModel: BoxModel | null): void {
    this.sendMessage({
      type: SlotControl.ITEM_BOX_MODEL_CHANGE,
      payload: { index, boxModel },
    })
  }
}
