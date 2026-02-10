import { SharedActionTypes, makeswiftConnectionInit } from '../shared-api'
import { makeswiftConnectionCheck } from './actions'

const CONNECTION_PING_INTERVAL_MS = 20

export class MessageChannel {
  private readonly appOrigin: string
  private channel: MessagePort | null = null
  private bufferedMessages: [any, Transferable[]?][] = []
  private connectionCheckIntervalID: number | null = null

  constructor({ appOrigin }: { appOrigin: string }) {
    this.appOrigin = appOrigin
  }

  public postMessage(message: any, transferables?: Transferable[]) {
    if (this.channel) {
      this.channel.postMessage(message, transferables ?? [])
    } else {
      this.bufferedMessages.push([message, transferables])
    }
  }

  public setup(onMessage: (event: MessageEvent) => void) {
    this.setupConnectionCheck()

    const channel = new window.MessageChannel()
    channel.port1.onmessage = onMessage

    // connect channel to the parent window, see
    // https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API
    window.parent.postMessage(channel.port2, this.appOrigin, [channel.port2])

    this.channel = channel.port1
  }

  public dispatchBuffered() {
    console.assert(this.channel != null, 'channel is not setup')

    this.bufferedMessages.forEach(([message, transferables]) => {
      this.channel?.postMessage(message, transferables ?? [])
    })

    this.bufferedMessages = []
  }

  public teardown() {
    this.teardownConnectionCheck()

    if (this.channel) {
      this.channel.onmessage = null
      this.channel.close()
    }
  }

  private setupConnectionCheck() {
    window.addEventListener('message', this.connectionCheckHandler)
    window.parent.postMessage(makeswiftConnectionInit(), { targetOrigin: this.appOrigin })
  }

  private teardownConnectionCheck() {
    window.removeEventListener('message', this.connectionCheckHandler)
    if (this.connectionCheckIntervalID != null) {
      window.clearInterval(this.connectionCheckIntervalID)
      this.connectionCheckIntervalID = null
    }
  }

  // use class field syntax to preserve the identity of the handler
  // for adding and removing the event listener
  private connectionCheckHandler = (event: MessageEvent) => {
    if (
      event.origin === this.appOrigin &&
      event.data.type === SharedActionTypes.MAKESWIFT_CONNECTION_INIT
    ) {
      if (this.connectionCheckIntervalID != null) {
        window.clearInterval(this.connectionCheckIntervalID)
        this.connectionCheckIntervalID = null
      }

      this.connectionCheckIntervalID = window.setInterval(() => {
        window.parent.postMessage(makeswiftConnectionCheck({ currentUrl: window.location.href }), {
          targetOrigin: this.appOrigin,
        })
      }, CONNECTION_PING_INTERVAL_MS)
    }
  }
}
