import isErrorWithMessage from '../../utils/isErrorWithMessage'
import {
  type ApiRequest,
  type ErrorResponseBody,
  ApiResponse,
  searchParams,
} from '../request-response'

type RevalidationResult = { revalidated: boolean }

export async function revalidateHandler(
  req: ApiRequest,
  { apiKey, revalidatePath }: { apiKey: string; revalidatePath: (path: string) => Promise<void> },
): Promise<ApiResponse<RevalidationResult | ErrorResponseBody>> {
  const params = searchParams(req)

  const secret = params.get('secret')
  if (secret !== apiKey) {
    return ApiResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const path = params.get('path')
  if (typeof path !== 'string') {
    return ApiResponse.json({ message: 'Bad Request' }, { status: 400 })
  }

  try {
    await revalidatePath(path)
    return ApiResponse.json({ revalidated: true })
  } catch (error) {
    if (isErrorWithMessage(error)) {
      return ApiResponse.json({ message: error.message }, { status: 500 })
    }

    return ApiResponse.json({ message: 'Error Revalidating' }, { status: 500 })
  }
}
