export type ControlMessage<Payload = unknown> = {
  type: string
  payload?: Payload
}

export type SendMessage<M extends ControlMessage = ControlMessage<unknown>> = (
  message: M,
) => void

export abstract class ControlInstance<
  M extends ControlMessage = ControlMessage<unknown>,
> {
  constructor(protected readonly sendMessage: SendMessage<M>) {}

  abstract recv(message: M): void
  abstract child(key: string): ControlInstance | undefined
}

export class DefaultControlInstance extends ControlInstance {
  recv(_message: ControlMessage<unknown>) {
    // Do nothing
  }

  child(_key: string) {
    return undefined
  }
}

export type SendMessageType<I> = I extends ControlInstance<infer M> ? M : never
