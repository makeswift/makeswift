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
}

export class DefaultControlInstance extends ControlInstance {
  recv(_message: ControlMessage) {
    // Do nothing
  }

  child(_key: string) {
    return undefined
  }
}

export type SendMessageType<I> = I extends ControlInstance<infer M> ? M : never
