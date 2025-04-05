import { useEffect, useRef } from 'react'
import { ActionTypes } from '../../../../react'

const CONNECTION_PING_INTERVAL_MS = 20

export function useBuilderConnectionPing(appOrigin: string) {
  const sanitizedAppOrigin = appOrigin.replace("'", "\\'")

  const connectionInterval = useRef<number | null>(null)

  useEffect(() => {
    if (window.parent !== window) {
      window.addEventListener('message', messageHandler)
      window.parent.postMessage({ type: ActionTypes.MAKESWIFT_CONNECTION_INIT }, appOrigin)
    }

    return () => {
      window.removeEventListener('message', messageHandler)
      if (connectionInterval.current != null) {
        window.clearInterval(connectionInterval.current)
      }
    }

    function messageHandler(event: MessageEvent): void {
      if (
        event.origin === sanitizedAppOrigin &&
        event.data.type === ActionTypes.MAKESWIFT_CONNECTION_INIT
      ) {
        if (connectionInterval.current != null) {
          window.clearInterval(connectionInterval.current)
        }

        connectionInterval.current = window.setInterval(() => {
          window.parent.postMessage(
            {
              type: ActionTypes.MAKESWIFT_CONNECTION_CHECK,
              payload: { currentUrl: window.location.href },
            },
            appOrigin,
          )
        }, CONNECTION_PING_INTERVAL_MS)
      }
    }
  }, [sanitizedAppOrigin])
}
