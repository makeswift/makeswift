import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useIsInBuilder } from '../../hooks/use-is-in-builder'
import { DraftToolbar } from './draft-toolbar'

const ClearDraftModeRequestPath = '/api/makeswift/clear-draft'

async function exitDraftMode() {
  try {
    await fetch(ClearDraftModeRequestPath)
    window.location.reload()
  } catch (err) {
    console.error('Could not clear Makeswift cookies. Please report this error to your developer.')
    console.error(err)
  }
}

export function DraftSwitcher({ isDraft }: { isDraft: boolean }) {
  const shadowContainerRef = useRef<HTMLSpanElement | null>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  const isInBuilder = useIsInBuilder()

  const showToolbar = !isInBuilder && isDraft

  useEffect(() => {
    if (!showToolbar) return
    if (
      shadowContainerRef.current &&
      shadowContainerRef.current.shadowRoot == null &&
      shadowRoot == null
    ) {
      const root = shadowContainerRef.current.attachShadow({ mode: 'open' })
      setShadowRoot(root)
    }
  }, [showToolbar, shadowRoot, setShadowRoot])

  if (!showToolbar) return null

  return (
    <>
      {showToolbar && (
        <span id="makeswift-draft-switcher" ref={shadowContainerRef}>
          {shadowRoot
            ? createPortal(<DraftToolbar onExitDraft={exitDraftMode} />, shadowRoot)
            : null}
        </span>
      )}
      <script
        type="application/json"
        id="makeswift-draft-info"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ draft: isDraft, inBuilder: isInBuilder }),
        }}
      />
    </>
  )
}
