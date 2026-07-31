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

  subscribe(_listener: () => void): () => void {
    // No mutable state, nothing to subscribe to
    return () => {}
  }

  isCompositeProp(): boolean {
    return false
  }

  children(): ControlInstance[] {
    return []
  }

  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  resolvesToRenderableNode(): boolean {
    return false
  }

  changeBoxModel(boxModel: BoxDisplayModel | null): void {
    this.sendMessage({
      type: StyleControl.CHANGE_BOX_MODEL,
      payload: { boxModel },
    })
  }
}
