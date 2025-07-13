import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { PageMeta } from '../../../../next/components/head-tags'
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

  return (
    <>
      {showToolbar && (
        <span id="makeswift-draft-switcher" ref={shadowContainerRef}>
          {shadowRoot
            ? createPortal(<DraftToolbar onExitDraft={exitDraftMode} />, shadowRoot)
            : null}
        </span>
      )}
      {/* Insert draft mode information into the DOM to make it easier to debug draft mode-related 
          issues on production sites */}
      <PageMeta
        name="makeswift-draft-info"
        content={JSON.stringify({ draft: isDraft, inBuilder: isInBuilder })}
      />
    </>
  )
}
