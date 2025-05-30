import { type Data } from '../../state/react-page'
import { MakeswiftClient } from '../../client'
import { type ApiRequest, ApiResponse } from '../request-response'

type TranslatableDataResult = { translatableData: Record<string, Data> }
type TranslatableDataError = { message: string }

export type TranslatableDataResponse = TranslatableDataResult | TranslatableDataError

export async function translatableDataHandler(
  req: ApiRequest,
  { client }: { client: MakeswiftClient },
): Promise<ApiResponse> {
  const body = await req.json()

  const { elementTree } = body

  if (elementTree == null) {
    return ApiResponse.json({ message: 'elementTree must be defined.' }, { status: 400 })
  }

  try {
    let translatableData = client.getTranslatableData(elementTree)
    return ApiResponse.json({ translatableData })
  } catch (error) {
    return ApiResponse.json({ message: 'Failed to get translatable data.' }, { status: 500 })
  }
}
