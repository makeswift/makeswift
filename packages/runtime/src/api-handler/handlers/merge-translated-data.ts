import { type Element } from '../../state/react-page'
import { MakeswiftClient } from '../../client'
import { type ApiRequest, type ApiResponse, type ErrorResponseBody } from '../request-response'

type TranslatedData = { elementTree: Element }

export async function mergeTranslatedDataHandler(
  req: ApiRequest,
  res: ApiResponse,
  { client }: { client: MakeswiftClient },
): Promise<ApiResponse<TranslatedData | ErrorResponseBody>> {
  const body = await req.json()
  const { translatedData, elementTree } = body

  if (translatedData == null) {
    return res.status(400).json({ message: 'translatedData must be defined' })
  }

  if (elementTree == null) {
    return res.status(400).json({ message: 'elementTree must be defined' })
  }

  const translatedElementTree = client.mergeTranslatedData(elementTree, translatedData)
  return res.json({ elementTree: translatedElementTree })
}
