import { type BoxDisplayModel } from '../../../common'

import { ControlInstance } from '../../instance'

type Message = {
  type: typeof StyleControl.CHANGE_BOX_MODEL
  payload: { boxModel: BoxDisplayModel | null }
}

export class StyleControl extends ControlInstance<Message> {
  static CHANGE_BOX_MODEL =
    'makeswift::controls::style::message::change-box-model'

  recv = (_message: Message) => {}

  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  changeBoxModel(boxModel: BoxDisplayModel | null): void {
    this.sendMessage({
      type: StyleControl.CHANGE_BOX_MODEL,
      payload: { boxModel },
    })
  }
}
