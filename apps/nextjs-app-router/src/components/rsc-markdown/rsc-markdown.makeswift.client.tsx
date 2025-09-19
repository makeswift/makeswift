import { runtime } from '@/makeswift/runtime'
import { RscMarkdownRegistration } from './rsc-markdown.registration'

runtime.registerComponent(
  () => <h1>You shouldn't see this</h1>,
  RscMarkdownRegistration,
)
