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

  public setup(onMessage: (event: MessageEvent) => void) {
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
    if (this.channel) {
      this.channel.onmessage = null
      this.channel.close()
    }
  }
}
