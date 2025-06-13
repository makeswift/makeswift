'use client'

import { loadRemote, registerRemotes, init } from '@module-federation/enhanced/runtime'
import { useEffect } from 'react'
import { runtime } from './runtime'
import { ReactRuntime } from '@makeswift/runtime/dist/types/react'

init({
  name: 'proxy-express-node',
  remotes: []
})

export function RemoteComponents() {
  useEffect(() => {
    registerRemotes([{
      name: 'remote_button_component',
      entry: 'http://localhost:3001/remoteEntry.js'
    }])

    loadRemote<{ register: (runtime: ReactRuntime) => () => void }>('remote_button_component/register').then(module => {
      module?.register(runtime)
    })
  })

  return null
}