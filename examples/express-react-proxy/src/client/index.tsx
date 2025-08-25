import React, { ComponentPropsWithoutRef } from 'react'
import ReactDOM from 'react-dom/client'

import { RootStyleRegistry } from '@makeswift/express-react'

import { EditableRegion } from '../makeswift/editable-region'
import { HYDRATION_PROPS_NAMESPACE } from '../makeswift/hydration'

declare global {
  interface Window {
    [HYDRATION_PROPS_NAMESPACE]: {
      regionProps: ComponentPropsWithoutRef<typeof EditableRegion>
      selector: string
    }
  }
}

function hydrate() {
  const data = window[HYDRATION_PROPS_NAMESPACE]

  if (!data) {
    console.error('No hydration data found')
    return
  }

  const targetElement = document.querySelector(data.selector)

  if (!targetElement) {
    console.error(`Target element with selector "${data.selector}" not found`)
    return
  }

  ReactDOM.hydrateRoot(
    targetElement,
    <React.StrictMode>
      <RootStyleRegistry>
        <EditableRegion {...data.regionProps} />
      </RootStyleRegistry>
    </React.StrictMode>,
  )

  console.log('Successfully hydrated Makeswift content')
}

if (typeof window !== 'undefined' && window[HYDRATION_PROPS_NAMESPACE]) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate)
  } else {
    hydrate()
  }
}
