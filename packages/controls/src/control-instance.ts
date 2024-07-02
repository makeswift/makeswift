export type ControlMessage<Type extends string = string, Payload = unknown> = {
  type: Type
  payload: Payload
}

export type Send<M = ControlMessage> = (message: M) => void

export abstract class ControlInstance<
  M extends ControlMessage = ControlMessage,
> {
  protected send: Send<M>

  constructor(send: Send<M>) {
    this.send = send
  }

  abstract recv(message: M): void
}

export class DefaultControlInstance extends ControlInstance {
  recv(_message: ControlMessage) {
    // Do nothing
  }
}

export type MessageType<I> = I extends ControlInstance<infer M> ? M : never
export type SendType<I> = Send<MessageType<I>>
