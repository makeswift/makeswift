import React, { ComponentPropsWithoutRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Region } from '../makeswift/Region'
import {
  createRootStyleCache,
  RootStyleRegistry,
} from '@makeswift/runtime/next'

export const EDITOR_PROPS_NAMESPACE = '__EDITOR_PROPS__'

declare global {
  interface Window {
    __EDITOR_PROPS__: ComponentPropsWithoutRef<typeof Region> & {
      regionId: string
    }
  }
}

function hydrateEditor() {
  const props = window[EDITOR_PROPS_NAMESPACE]

  if (!props) {
    console.error('No editor props found for hydration')
    return
  }

  const targetElement = document.getElementById(props.regionId)

  if (!targetElement) {
    console.error(`Target element with id "${props.regionId}" not found`)
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

if (typeof window !== 'undefined' && window.__EDITOR_PROPS__) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateEditor)
  } else {
    hydrateEditor()
  }
}
