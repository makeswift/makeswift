import { NextApiRequest, NextApiResponse } from 'next'
import { Element } from '../../../state/react-page'
import { Makeswift } from '../../client'

type TranslatedDataResult = { elementTree: Element }

type TranslatedDataError = { message: string }

export type TranslatedDataResponse = TranslatedDataResult | TranslatedDataError

export default async function mergeTranslatedData(
  req: NextApiRequest,
  res: NextApiResponse<TranslatedDataResponse>,
  client: Makeswift,
): Promise<void> {
  const translatedData = req.body.translatedData
  const elementTree = req.body.elementTree

  if (translatedData == null) {
    return res.status(400).json({ message: 'translatedData must be defined' })
  }

  if (elementTree == null) {
    return res.status(400).json({ message: 'elementTree must be defined' })
  }

  const translatedElementTree = client.mergeTranslatedData(elementTree, translatedData)

  return res.json({ elementTree: translatedElementTree })
}
