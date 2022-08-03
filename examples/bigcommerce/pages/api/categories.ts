import { getCategories } from 'lib/bigcommerce'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await getCategories()
    res.status(200).json(categories)
  } catch (error) {
    console.error('Failed to fetch categories', error)
    res.status(400).json({ message: 'Failed to fetch categories' })
  }
}
