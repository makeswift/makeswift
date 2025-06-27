import { Action } from '../react'

export interface IMessageChannel {
  postMessage(message: any, transferables?: Transferable[]): void
  dispatchBuffered(): void
}

export class MessageChannel implements IMessageChannel {
  private channel: MessagePort | null = null
  private bufferedMessages: [Action, Transferable[]?][] = []

  private readonly listeners = new Set<(e: MessageEvent<Action>) => void>()

  public postMessage(message: any, transferables?: Transferable[]) {
    if (this.channel) {
      this.channel.postMessage(message, transferables ?? [])
    } else {
      this.bufferedMessages.push([message, transferables])
    }
  }

  public setup(onMessage: (event: MessageEvent<Action>) => void) {
    const channel = new window.MessageChannel()
    this.channel = channel.port1

    this.listen(onMessage)

    this.channel.start()

    // Connect channel to the parent window
    window.parent.postMessage(channel.port2, '*', [channel.port2])
  }

  public listen(onMessage: (event: MessageEvent<Action>) => void) {
    if (!this.channel) {
      console.warn('channel is not setup')
      return
    }

    this.channel.addEventListener('message', onMessage)
    this.listeners.add(onMessage)
  }

  public dispatchBuffered() {
    console.assert(this.channel != null, 'channel is not setup')

    this.bufferedMessages.forEach(([message, transferables]) => {
      this.channel!.postMessage(message, transferables ?? [])
    })

    this.bufferedMessages = []
  }

  public teardown() {
    if (!this.channel) return

    for (const listener of this.listeners) {
      this.channel.removeEventListener('message', listener)
    }
    this.listeners.clear()

    this.channel.close()
    this.channel = null
  }
}
