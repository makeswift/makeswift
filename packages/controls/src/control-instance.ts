export type ControlMessage<Payload = any> = {
  type: string
  payload?: Payload
  [key: string]: any
}

export type SendMessage<M extends ControlMessage = ControlMessage> = (
  message: M,
) => void

export abstract class ControlInstance<
  M extends ControlMessage = ControlMessage,
> {
  constructor(protected readonly sendMessage: SendMessage<M>) {}

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
