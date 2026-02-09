import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { PageMeta } from '../page/head-tags'
import { useIsInBuilder } from '../../hooks/use-is-in-builder'
import { PreviewToolbar } from './preview-toolbar'

export function PreviewSwitcher({ isPreview }: { isPreview: boolean }) {
  const isInBuilder = useIsInBuilder()
  const showToolbar = !isInBuilder && isPreview
  return (
    <>
      {showToolbar && <PreviewToolbarSingleton id="makeswift-preview-switcher" />}
      {/* Insert preview mode information into the DOM to make it easier to debug preview mode-related
          issues on production sites */}
      <PageMeta
        name="makeswift-preview-info"
        content={JSON.stringify({ isPreview: isPreview, inBuilder: isInBuilder })}
      />
    </>
  )
}

function PreviewToolbarSingleton({ id }: { id: string }) {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)
  const containerRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (document.getElementById(id) != null) {
      return
    }

    const container = document.createElement('span')
    container.id = id
    document.body.appendChild(container)

    containerRef.current = container
    setShadowRoot(container.shadowRoot ?? container.attachShadow({ mode: 'open' }))

    return () => {
      containerRef.current?.remove()
      containerRef.current = null
    }
  }, [id])

  return shadowRoot != null ? createPortal(<PreviewToolbar />, shadowRoot) : null
}
