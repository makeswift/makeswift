import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { PageMeta } from '../page/head-tags'
import { useIsInBuilder } from '../../hooks/use-is-in-builder'
import { PreviewToolbar } from './preview-toolbar'

const ExitPreviewRequestPath = '/api/makeswift/exit-preview'

async function exitPreview() {
  try {
    await fetch(ExitPreviewRequestPath)
    window.location.reload()
  } catch (err) {
    console.error('Could not clear Makeswift cookies. Please report this error to your developer.')
    console.error(err)
  }
}

export function PreviewSwitcher({ isPreview }: { isPreview: boolean }) {
  const shadowContainerRef = useRef<HTMLSpanElement | null>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  const isInBuilder = useIsInBuilder()

  const showToolbar = !isInBuilder && isPreview

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
        <span id="makeswift-preview-switcher" ref={shadowContainerRef}>
          {shadowRoot
            ? createPortal(<PreviewToolbar onExitPreview={exitPreview} />, shadowRoot)
            : null}
        </span>
      )}
      {/* Insert preview mode information into the DOM to make it easier to debug preview mode-related
          issues on production sites */}
      <PageMeta
        name="makeswift-preview-info"
        content={JSON.stringify({ isPreview: isPreview, inBuilder: isInBuilder })}
      />
    </>
  )
}
