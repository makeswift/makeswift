import { type Snippet } from '../../client/page-snapshot'

export const createSnippet = ({ id, code }: { id: string; code: string }): Snippet => ({
  id,
  code,
  location: 'HEAD',
  liveEnabled: true,
  builderEnabled: true,
  cleanup: null,
})
