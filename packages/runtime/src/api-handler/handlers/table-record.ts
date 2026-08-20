import { MakeswiftClient } from '../../client'
import { RestApiClientError } from '../../api/rest-api-client'
import { type ApiRequest, ApiResponse, type ErrorResponseBody } from '../request-response'
import isErrorWithMessage from '../../utils/isErrorWithMessage'

export async function tableRecordHandler(
  req: ApiRequest,
  { client }: { client: MakeswiftClient },
): Promise<ApiResponse<ErrorResponseBody> | Response> {
  const body = await req.json()
  const { tableId, columns } = body

  if (typeof tableId !== 'string') {
    return ApiResponse.json({ message: 'tableId must be a string' }, { status: 400 })
  }

  if (!Array.isArray(columns)) {
    return ApiResponse.json({ message: 'columns must be an array' }, { status: 400 })
  }

  try {
    await client.createTableRecord(tableId, columns)
    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof RestApiClientError) {
      return ApiResponse.json({ message: error.message }, { status: error.status })
    }

    if (isErrorWithMessage(error)) {
      return ApiResponse.json({ message: error.message }, { status: 500 })
    }

    return ApiResponse.json({ message: 'Error creating table record' }, { status: 500 })
  }
}
