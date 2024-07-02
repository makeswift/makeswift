export type ControlMessage<Payload = unknown> = {
  type: string
  payload: Payload
}

export type SendMessage<Payload = unknown> = (
  message: ControlMessage<Payload>,
) => void

export abstract class ControlInstance<Payload = unknown> {
  constructor(protected readonly sendMessage: SendMessage<Payload>) {}
  abstract recv(message: ControlMessage<Payload>): void
}

export class DefaultControlInstance extends ControlInstance {
  recv(_message: ControlMessage<unknown>) {
    // Do nothing
  }
}

export type PayloadType<I> = I extends ControlInstance<infer P> ? P : never
export type SendMessageType<I> = SendMessage<PayloadType<I>>
