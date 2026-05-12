import { type BoxDisplayModel } from '../../common'

import { ControlInstance } from '../instance'

type BoxModelChangeMessage = {
  type: typeof SlotControl.CONTAINER_BOX_MODEL_CHANGE
  payload: { boxModel: BoxDisplayModel | null }
}

type ItemBoxModelChangeMessage = {
  type: typeof SlotControl.ITEM_BOX_MODEL_CHANGE
  payload: { index: number; boxModel: BoxDisplayModel | null }
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

  changeContainerBoxModel(boxModel: BoxDisplayModel | null): void {
    this.sendMessage({
      type: SlotControl.CONTAINER_BOX_MODEL_CHANGE,
      payload: { boxModel },
    })
  }

  changeItemBoxModel(index: number, boxModel: BoxDisplayModel | null): void {
    this.sendMessage({
      type: SlotControl.ITEM_BOX_MODEL_CHANGE,
      payload: { index, boxModel },
    })
  }
}
