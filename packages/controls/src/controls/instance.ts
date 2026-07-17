import { type Data } from '../common/types'

export type ControlMessage<Payload = Data> = {
  [key: string]: Data
} & {
  type: string
  payload?: Payload
}

export type ControlInstanceKey = {
  elementKey: string
  propPath: string
}

export type ControlInstanceArgs<M extends ControlMessage = ControlMessage> = {
  instanceKey: ControlInstanceKey
  sendMessage: SendMessage<M>
}

export type SendMessage<M extends ControlMessage = ControlMessage> = (
  message: M,
) => void

export abstract class ControlInstance<
  M extends ControlMessage = ControlMessage,
> {
  public readonly instanceKey: ControlInstanceKey
  protected readonly sendMessage: SendMessage<M>

  constructor({ instanceKey, sendMessage }: ControlInstanceArgs<M>) {
    this.instanceKey = instanceKey
    this.sendMessage = sendMessage
  }

  get elementKey() {
    return this.instanceKey.elementKey
  }

  get propPath() {
    return this.instanceKey.propPath
  }

  abstract recv(message: M): void
  abstract child(key: string): ControlInstance | undefined

  /**
   * Returns true if the control resolves to a renderable node.
   *
   * In React, that means the resolved value is a `ReactNode`. In other renderers, it is the equivalent
   * renderable node type.
   */
  abstract resolvesToRenderableNode(): boolean
}

export class DefaultControlInstance extends ControlInstance {
  recv(_message: ControlMessage) {
    // Do nothing
  }

  child(_key: string) {
    return undefined
  }

  resolvesToRenderableNode(): boolean {
    return false
  }
}

export type SendMessageType<I> = I extends ControlInstance<infer M> ? M : never
