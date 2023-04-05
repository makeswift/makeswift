import { NextApiRequest, NextApiResponse } from 'next'
import { ReactRuntime } from '../../../react'
import { Element } from '../../../state/react-page'

type ElementTreeResult = { elementTree: Element }

type ElementTreeError = { message: string }

export type ElementTreeResponse = ElementTreeResult | ElementTreeError

export default async function elementTree(
  req: NextApiRequest,
  res: NextApiResponse<ElementTreeResponse>,
): Promise<void> {
  const elementTree = req.body.elementTree
  const replacementContext = req.body.replacementContext

  if (elementTree == null) {
    return res.status(400).json({ message: 'elementTree must be defined' })
  }

  if (replacementContext == null) {
    return res.status(400).json({ message: 'replacementContext must be defined' })
  }

  const generatedElementTree = ReactRuntime.copyElementTree(elementTree, replacementContext)

  const response = { elementTree: generatedElementTree }
  return res.json(response)
}
