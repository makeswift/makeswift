import {
  createRootStyleCache,
  RootStyleRegistry,
} from '@makeswift/runtime/next'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

const { cache } = createRootStyleCache({ key: 'mswft' })

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RootStyleRegistry cache={cache}>
        <HydratedRouter />
      </RootStyleRegistry>
    </StrictMode>,
  )
})
