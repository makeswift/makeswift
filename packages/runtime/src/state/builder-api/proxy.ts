import { type HostAction, isHostAction } from '../host-api'

import { type BuilderAction, hasTransferables } from './actions'
import { MessageChannel } from './message-channel'

export class BuilderAPIProxy {
  private messageChannel: MessageChannel

  constructor({ appOrigin }: { appOrigin: string }) {
    this.messageChannel = new MessageChannel({ appOrigin })
  }

  // low-level, action-based API

  setup({ onHostAction }: { onHostAction: (action: HostAction) => void }): void {
    this.messageChannel.setup((event: MessageEvent) => {
      const action = event.data

      if (!isHostAction(action)) {
        console.warn('Unexpected host action', action)
        return
      }

      onHostAction(action)
    })
  }

  execute(action: BuilderAction): void {
    if (hasTransferables(action)) {
      const { transferables, ...forwardedAction } = action
      this.messageChannel.postMessage(forwardedAction, transferables)
      return
    }

    this.messageChannel.postMessage(action)
  }

  dispatchBuffered(): void {
    this.messageChannel.dispatchBuffered()
  }

  teardown(): void {
    this.messageChannel.teardown()
  }
}
