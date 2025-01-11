import { ControlInstance, type ControlMessage } from '../../instance'

type Message = {
  type: typeof ShapeV2Control.CHILD_CONTROL_MESSAGE
  payload: { message: ControlMessage; key: string }
}

export abstract class ShapeV2Control extends ControlInstance<Message> {
  static readonly CHILD_CONTROL_MESSAGE =
    'makeswift::controls::shape-v2::message::child-control-message'
}
