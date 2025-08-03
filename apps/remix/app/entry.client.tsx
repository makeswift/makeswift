import {
  createRootStyleCache,
  RootStyleRegistry,
} from '@makeswift/runtime/remix'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

const { cache, flush } = createRootStyleCache()

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
