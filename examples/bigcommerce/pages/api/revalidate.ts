import { getProducts } from 'lib/bigcommerce'
import { getConfig } from 'lib/config'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = getConfig()

  if (req.query.secret !== config.makeswift.revalidationSecret) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const products = await getProducts()
    await Promise.all(products.map(product => res.revalidate(`/product/${product.entityId}`)))
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
