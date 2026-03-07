import { type HostAction, isHostAction } from '../host-api'

import { type BuilderAction, BuilderActionTypes, hasTransferables } from './actions'
import { MessageChannel } from './message-channel'
import { setupNavigationListener } from './navigation-listener'
import { type BuilderApi, type HostNavigationEvent } from './api'

export class BuilderAPIProxy implements BuilderApi {
  private messageChannel: MessageChannel

  constructor({ appOrigin }: { appOrigin: string }) {
    this.messageChannel = new MessageChannel({ appOrigin })
  }

  handleHostNavigate(event: HostNavigationEvent) {
    this.execute({ type: BuilderActionTypes.HANDLE_HOST_NAVIGATE, payload: event })
  }

  // low-level, action-based API

  setup({ onHostAction }: { onHostAction: (action: HostAction) => void }): VoidFunction {
    const channelCleanup = this.messageChannel.setup({
      onMessage: (event: MessageEvent) => {
        const action = event.data

        if (!isHostAction(action)) {
          console.warn('Unexpected host action', action)
          return
        }

        onHostAction(action)
      },
    })

    const navigationListenerCleanup = setupNavigationListener(event =>
      this.handleHostNavigate(event),
    )

    return () => {
      channelCleanup()
      navigationListenerCleanup()
    }
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
}
