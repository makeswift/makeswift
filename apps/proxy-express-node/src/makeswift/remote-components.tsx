'use client'

import React, { useEffect } from 'react'
import { runtime } from './runtime'

export function RemoteComponents() {
  useEffect(() => {
    console.log('registering remote component')
    return runtime.registerComponent(
      function RemoteComponent() {
        return <p>Remote component!!!</p>
      },
      {
        type: 'remote-component',
        label: 'Remote Component',
        props: {},
      },
    )
  }, [])

  return null
}