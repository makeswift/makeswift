export type Send<T = unknown> = (message: T) => void

export abstract class ControlInstance<T> {
  protected send: Send<T>

  constructor(send: Send<T>) {
    this.send = send
  }

  abstract recv(message: T): void
}

export class DefaultControlInstance extends ControlInstance<unknown> {
  recv(_message: unknown) {
    // Do nothing
  }
}
