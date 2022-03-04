import type { Descriptor } from './descriptors'

type Send<T> = (message: T) => void

export abstract class PropController<T = unknown> {
  protected send: Send<T>

  constructor(send: Send<T>) {
    this.send = send
  }

  abstract recv(message: T): void
}

class DefaultPropController extends PropController {
  recv(): void {
    // Do nothing.
  }
}

export function createPropController(
  descriptor: Descriptor,
  send: (message: unknown) => void,
): PropController {
  switch (descriptor.type) {
    default:
      return new DefaultPropController(send)
  }
}
