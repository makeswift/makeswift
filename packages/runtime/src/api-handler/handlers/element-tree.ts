import { ReactRuntimeCore } from '../../react'
import { type Element } from '../../state/react-page'
import { type ApiRequest, ApiResponse, type ErrorResponseBody } from '../request-response'

export async function elementTreeHandler(
  req: ApiRequest,
  { runtime }: { runtime: ReactRuntimeCore },
): Promise<ApiResponse<{ elementTree: Element } | ErrorResponseBody>> {
  const body = await req.json()
  const { elementTree, replacementContext } = body

  if (elementTree == null) {
    return ApiResponse.json({ message: 'elementTree must be defined' }, { status: 400 })
  }

  if (replacementContext == null) {
    return ApiResponse.json({ message: 'replacementContext must be defined' }, { status: 400 })
  }

  const generatedElementTree = runtime.copyElementTree(elementTree, replacementContext)
  return ApiResponse.json({ elementTree: generatedElementTree })
}
