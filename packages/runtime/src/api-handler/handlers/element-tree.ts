import { ReactRuntime } from '../../react'
import { type Element } from '../../state/react-page'
import { type ApiRequest, type ApiResponse, type ErrorResponseBody } from '../request-response'

export async function elementTreeHandler(
  req: ApiRequest,
  res: ApiResponse,
  { runtime }: { runtime: ReactRuntime },
): Promise<ApiResponse<{ elementTree: Element } | ErrorResponseBody>> {
  const body = await req.json()
  const { elementTree, replacementContext } = body

  if (elementTree == null) {
    return res.status(400).json({ message: 'elementTree must be defined' })
  }

  if (replacementContext == null) {
    return res.status(400).json({ message: 'replacementContext must be defined' })
  }

  const generatedElementTree = runtime.copyElementTree(elementTree, replacementContext)
  return res.json({ elementTree: generatedElementTree })
}
