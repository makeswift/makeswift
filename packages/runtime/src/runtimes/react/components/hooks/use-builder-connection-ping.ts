import { useEffect } from 'react'
import { ActionTypes } from '../../../../react'

const CONNECTION_PING_INTERVAL_MS = 20

export function useBuilderConnectionPing({ appOrigin }: { appOrigin: string }) {
  useEffect(() => {
    let connectionInterval: number | null

    if (window.parent !== window) {
      window.addEventListener('message', messageHandler)
      window.parent.postMessage(
        { type: ActionTypes.MAKESWIFT_CONNECTION_INIT },
        { targetOrigin: appOrigin },
      )
    }

    return () => {
      window.removeEventListener('message', messageHandler)
      if (connectionInterval != null) {
        window.clearInterval(connectionInterval)
        connectionInterval = null
      }
    }

    function messageHandler(event: MessageEvent): void {
      if (event.origin === appOrigin && event.data.type === ActionTypes.MAKESWIFT_CONNECTION_INIT) {
        if (connectionInterval != null) {
          window.clearInterval(connectionInterval)
          connectionInterval = null
        }

        connectionInterval = window.setInterval(() => {
          window.parent.postMessage(
            {
              type: ActionTypes.MAKESWIFT_CONNECTION_CHECK,
              payload: { currentUrl: window.location.href },
            },
            { targetOrigin: appOrigin },
          )
        }, CONNECTION_PING_INTERVAL_MS)
      }
    }
  }, [appOrigin])
}
