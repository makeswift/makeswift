import { getCategories } from 'lib/bigcommerce'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const categories = await getCategories()
  res.status(200).json(categories)
}
