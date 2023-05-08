import type { PropControllerMessage, Send } from './instances'

export abstract class PropController<T = PropControllerMessage> {
  protected send: Send<T>

  constructor(send: Send<T>) {
    this.send = send
  }

  abstract recv(message: T): void
}
