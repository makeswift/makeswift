import { type Element } from '../../state/read-only-state'
import { MakeswiftClient } from '../../client'
import { type ApiRequest, ApiResponse, type ErrorResponseBody } from '../request-response'
import isErrorWithMessage from '../../utils/isErrorWithMessage'

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

  try {
    const translatedElementTree = client.mergeTranslatedData(elementTree, translatedData)
    return ApiResponse.json({ elementTree: translatedElementTree })
  } catch (error) {
    if (isErrorWithMessage(error)) {
      return ApiResponse.json({ message: error.message }, { status: 500 })
    }
    return ApiResponse.json({ message: 'Error merging translated data' }, { status: 500 })
  }
}
