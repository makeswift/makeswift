import isErrorWithMessage from '../../utils/isErrorWithMessage'
import { type ApiRequest, type ApiResponse, type ErrorResponseBody } from '../request-response'

type RevalidationResult = { revalidated: boolean }

export async function revalidateHandler(
  req: ApiRequest,
  res: ApiResponse,
  { apiKey, revalidatePath }: { apiKey: string; revalidatePath: (path: string) => Promise<void> },
): Promise<ApiResponse<RevalidationResult | ErrorResponseBody>> {
  const secret = req.getSearchParam('secret')
  if (secret !== apiKey) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const path = req.getSearchParam('path')
  if (typeof path !== 'string') {
    return res.status(400).json({ message: 'Bad Request' })
  }

  try {
    await revalidatePath(path)
    return res.json({ revalidated: true })
  } catch (error) {
    if (isErrorWithMessage(error)) {
      return res.status(500).json({ message: error.message })
    }

    return res.status(500).json({ message: 'Error Revalidating' })
  }
}
