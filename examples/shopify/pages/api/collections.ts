import { getCollections } from 'lib/shopify'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const collections = await getCollections()
    res.status(200).json(collections)
  } catch (error) {
    console.error('Failed to fetch collections', error)
    res.status(400).json({ message: 'Failed to fetch collections' })
  }
}
