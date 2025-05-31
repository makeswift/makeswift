import { type Data } from '../../state/react-page'
import { MakeswiftClient } from '../../client'
import { type ApiRequest, type ApiResponse } from '../request-response'

type TranslatableDataResult = { translatableData: Record<string, Data> }
type TranslatableDataError = { message: string }

export type TranslatableDataResponse = TranslatableDataResult | TranslatableDataError

export async function translatableDataHandler(
  req: ApiRequest,
  res: ApiResponse,
  { client }: { client: MakeswiftClient },
): Promise<ApiResponse> {
  const body = await req.json()

  const { elementTree } = body

  if (elementTree == null) {
    return res.status(400).json({ message: 'elementTree must be defined.' })
  }

  try {
    let translatableData = client.getTranslatableData(elementTree)
    return res.json({ translatableData })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get translatable data.' })
  }
}
