import { getConfig } from 'lib/config'
import { NextApiRequest, NextApiResponse } from 'next'

import { RedirectURLResponse, RestResponse } from 'lib/bigcommerce'
import urlJoin from 'url-join'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = getConfig()

  if (req.method !== 'GET') {
    return res.status(405)
  }

  if (req.query.cartId == null) {
    return res
      .status(400)
      .json({ message: "Failed to fetch checkout. 'cartId' query param required " })
  }

  const response = await fetch(
    urlJoin(config.bigcommerce.storeURL, `/v3/carts/${req.query.cartId}/redirect_urls`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': config.bigcommerce.storeToken,
      },
    },
  )

  if (!response.ok) throw new Error(response.statusText)

  const result: RestResponse<RedirectURLResponse> = await response.json()

  return res.status(200).json(result)
}
