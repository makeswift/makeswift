import { NextApiRequest, NextApiResponse } from 'next'
import { Data } from '../../../state/react-page'
import { Makeswift } from '../../client'

type TranslatableDataResult = { translatableData: Record<string, Data> }

type TranslatableDataError = { message: string }

export type TranslatableDataResponse = TranslatableDataResult | TranslatableDataError

export default async function translatableData(
  req: NextApiRequest,
  res: NextApiResponse<TranslatableDataResponse>,
  client: Makeswift,
): Promise<void> {
  const elementTree = req.body.elementTree

  if (elementTree == null) {
    return res.status(400).json({ message: 'elementTree must be defined' })
  }

  const translatableData = client.getTranslatableData(elementTree)

  return res.json({ translatableData })
}
