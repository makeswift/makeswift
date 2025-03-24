import { useEffect, useMemo } from 'react'
import { useIsPagesRouter } from '../../../../next/hooks/use-is-pages-router'

const PAGES_ROUTER_HANDSHAKE_MESSAGE = 'makeswift_preview_mode'
const APP_ROUTER_HANDSHAKE_MESSAGE = 'makeswift_draft_mode'

export function useBuilderHandshake({ appOrigin }: { appOrigin: string }) {
  const isPagesRouter = useIsPagesRouter()

  const handshakeInitiationMessage = useMemo(() => {
    if (isPagesRouter) return PAGES_ROUTER_HANDSHAKE_MESSAGE
    return APP_ROUTER_HANDSHAKE_MESSAGE
  }, [isPagesRouter])

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: handshakeInitiationMessage }, { targetOrigin: appOrigin })
    }
  }, [appOrigin, handshakeInitiationMessage])
}
