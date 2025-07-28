import { type Element } from '../../state/react-page'
import { MakeswiftClient } from '../../client'
import { type ApiRequest, ApiResponse, type ErrorResponseBody } from '../request-response'

type TranslatedData = { elementTree: Element }

export async function mergeTranslatedDataHandler(
  req: ApiRequest,
  { client }: { client: MakeswiftClient },
): Promise<ApiResponse<TranslatedData | ErrorResponseBody>> {
  const body = await req.json()
  const { translatedData, elementTree } = body

  if (translatedData == null) {
    return ApiResponse.json({ message: 'translatedData must be defined' }, { status: 400 })
  }

  if (elementTree == null) {
    return ApiResponse.json({ message: 'elementTree must be defined' }, { status: 400 })
  }

  const translatedElementTree = client.mergeTranslatedData(elementTree, translatedData)
  return ApiResponse.json({ elementTree: translatedElementTree })
}
