import { SharedActionTypes, makeswiftConnectionInit } from '../shared-api'
import { makeswiftConnectionCheck } from './actions'

const CONNECTION_PING_INTERVAL_MS = 20

export class MessageChannel {
  private readonly appOrigin: string
  private channel: MessagePort | null = null
  private bufferedMessages: [any, Transferable[]?][] = []

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

  public setup({ onMessage }: { onMessage: (event: MessageEvent) => void }): VoidFunction {
    const cleanupConnectionCheck = setupConnectionCheck(this.appOrigin)

    const channel = new window.MessageChannel()
    channel.port1.onmessage = onMessage

    // connect channel to the parent window, see
    // https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API
    window.parent.postMessage(channel.port2, this.appOrigin, [channel.port2])

    this.channel = channel.port1

    return () => {
      cleanupConnectionCheck()

      if (this.channel) {
        this.channel.onmessage = null
        this.channel.close()
        this.channel = null
      }
    }
  }

  public dispatchBuffered() {
    console.assert(this.channel != null, 'channel is not setup')

    this.bufferedMessages.forEach(([message, transferables]) => {
      this.channel?.postMessage(message, transferables ?? [])
    })

    this.bufferedMessages = []
  }
}

// FIXME: instead of `window.parent.postMessage`, the connection check should
// probably use the message channel itself: after all, it's meant to check
// the health of the builder <> host connection, and whether we can reach the
// builder through `window.parent.postMessage` is not indicative of the health
// of the message channel itself, which is what the builder <> host
// communication relies on.
function setupConnectionCheck(appOrigin: string): VoidFunction {
  class Interval {
    private id: number | null = null

    setInterval(callback: () => void, delay: number) {
      this.clear()
      this.id = window.setInterval(callback, delay)
    }

    clear() {
      if (this.id != null) {
        window.clearInterval(this.id)
        this.id = null
      }
    }
  }

  const connectionCheckInterval = new Interval()

  function connectionCheckHandler(event: MessageEvent) {
    if (
      event.origin === appOrigin &&
      event.data.type === SharedActionTypes.MAKESWIFT_CONNECTION_INIT
    ) {
      connectionCheckInterval.setInterval(
        () => window.parent.postMessage(makeswiftConnectionCheck(), { targetOrigin: appOrigin }),
        CONNECTION_PING_INTERVAL_MS,
      )
    }
  }

  window.addEventListener('message', connectionCheckHandler)
  window.parent.postMessage(makeswiftConnectionInit(), { targetOrigin: appOrigin })

  return () => {
    window.removeEventListener('message', connectionCheckHandler)
    connectionCheckInterval.clear()
  }
}
