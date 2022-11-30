import { getConfig } from 'lib/config'
import { NextApiRequest, NextApiResponse } from 'next'

import { CartResponse, RestResponse } from 'lib/bigcommerce'
import urlJoin from 'url-join'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = getConfig()

  if (req.method === 'GET') {
    if (req.query.cartId == null) {
      return res
        .status(400)
        .json({ message: "Failed to fetch cart. 'cartId' query param required." })
    }

    const response = await fetch(
      urlJoin(config.bigcommerce.storeURL, `/v3/carts/${req.query.cartId}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.storeToken,
        },
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    const result: RestResponse<CartResponse> = await response.json()

    return res.status(200).json(result)
  }

  if (req.method === 'POST') {
    if (req.query.cartId == null) {
      const lineItem = JSON.parse(req.body)?.line_item
      const response = await fetch(urlJoin(config.bigcommerce.storeURL, '/v3/carts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.storeToken,
        },
        body: JSON.stringify({
          line_items: lineItem ? [lineItem] : [],
          channel_id: config.bigcommerce.channelId,
        }),
      })

      if (!response.ok) throw new Error(response.statusText)

      const result: RestResponse<CartResponse> = await response.json()

      return res.status(200).json(result)
    }

    const lineItem = JSON.parse(req.body)?.line_item
    const response = await fetch(
      urlJoin(config.bigcommerce.storeURL, `/v3/carts/${req.query.cartId}/items`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.storeToken,
        },
        body: JSON.stringify({
          line_items: lineItem ? [lineItem] : [],
          channel_id: config.bigcommerce.channelId,
        }),
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    const result: RestResponse<CartResponse> = await response.json()

    return res.status(200).json(result)
  }

  if (req.method === 'PUT') {
    if (req.query.cartId == null) {
      return res
        .status(400)
        .json({ message: "Failed to update lineItem. 'cartId' query param required." })
    }

    if (req.query.lineItemId == null) {
      return res
        .status(400)
        .json({ message: "Failed to update lineItem. 'lineItemId' query param required." })
    }

    const response = await fetch(
      urlJoin(
        config.bigcommerce.storeURL,
        `/v3/carts/${req.query.cartId}/items/${req.query.lineItemId}`,
      ),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.storeToken,
        },
        body: req.body,
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    const result: RestResponse<CartResponse> = await response.json()

    return res.status(200).json(result)
  }

  if (req.method === 'DELETE') {
    if (req.query.cartId == null) {
      return res
        .status(400)
        .json({ message: "Failed to delete lineItem. 'cartId' query param required." })
    }

    if (req.query.lineItemId == null) {
      return res
        .status(400)
        .json({ message: "Failed to delete lineItem. 'lineItemId' query param required." })
    }

    const response = await fetch(
      urlJoin(
        config.bigcommerce.storeURL,
        `/v3/carts/${req.query.cartId}/items/${req.query.lineItemId}`,
      ),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.storeToken,
        },
      },
    )

    if (!response.ok) throw new Error(response.statusText)

    // empty cart case
    if (response.status === 204) {
      const response = await fetch(urlJoin(config.bigcommerce.storeURL, '/v3/carts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': config.bigcommerce.storeToken,
        },
        body: JSON.stringify({
          line_items: [],
          channel_id: config.bigcommerce.channelId,
        }),
      })

      if (!response.ok) throw new Error(response.statusText)

      const result: RestResponse<CartResponse | null> = await response.json()

      return res.status(200).json(result)
    }

    const result: RestResponse<CartResponse | null> = await response.json()

    return res.status(200).json(result)
  }

  return res.status(405).send('Method Not Allowed')
}
