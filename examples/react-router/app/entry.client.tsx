import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

import { RootStyleRegistry } from '@makeswift/react-router'

hydrateRoot(
  document,
  <RootStyleRegistry>
    <HydratedRouter />
  </RootStyleRegistry>
)
