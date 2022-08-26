import { getCollections } from 'lib/shopify'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getCollections()
  res.status(200).json(collections)
}
