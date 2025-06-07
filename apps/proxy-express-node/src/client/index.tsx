import React, { ComponentPropsWithoutRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Region } from '../makeswift/Region'
import {
  createRootStyleCache,
  RootStyleRegistry,
} from '@makeswift/runtime/next'
import {
  HYDRATION_PROPS_NAMESPACE,
  TARGET_ELEMENT_SELECTOR,
} from '../makeswift/constants'

declare global {
  interface Window {
    [HYDRATION_PROPS_NAMESPACE]: ComponentPropsWithoutRef<typeof Region>
  }
}

function hydrateEditor() {
  const props = window[HYDRATION_PROPS_NAMESPACE]

  if (!props) {
    console.error('No editor props found for hydration')
    return
  }

  const targetElement = document.querySelector(TARGET_ELEMENT_SELECTOR)

  if (!targetElement) {
    console.error(
      `Target element with selector "${TARGET_ELEMENT_SELECTOR}" not found`,
    )
    return
  }

  const { cache } = createRootStyleCache({ key: 'mswft' })

  // Use hydrateRoot for SSR hydration
  ReactDOM.hydrateRoot(
    targetElement,
    <React.StrictMode>
      <RootStyleRegistry cache={cache}>
        <Region {...props} />
      </RootStyleRegistry>
    </React.StrictMode>,
  )

  console.log('Visual editor hydrated successfully')
}

if (typeof window !== 'undefined' && window[HYDRATION_PROPS_NAMESPACE]) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateEditor)
  } else {
    hydrateEditor()
  }
}
