import { type BoxModel } from '../../../common'

import { ControlInstance } from '../../instance'

type Message = {
  type: typeof StyleControl.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

export class StyleControl extends ControlInstance<Message> {
  static CHANGE_BOX_MODEL =
    'makeswift::controls::style::message::change-box-model'

  recv = (_message: Message) => {}

  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.sendMessage({
      type: StyleControl.CHANGE_BOX_MODEL,
      payload: { boxModel },
    })
  }
}
