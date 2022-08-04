// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { getBearerToken } from '../products'

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log('asdf')
  const entityId = req.query.id

  const bearerTokenResponse = await getBearerToken()

  if (bearerTokenResponse.errors) {
    return res.status(500).json(bearerTokenResponse.errors)
  }

  const response = await fetch('https://makeswift-example.mybigcommerce.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + bearerTokenResponse.data.token,
    },
    body: JSON.stringify({
      query: `
      query SingleProduct (
        $entityId: Int!
      ){
        site {
          products (entityIds: [$entityId]) {
            edges {
              node {
                id
                entityId
                name
                defaultImage {
                  url(width:400)
                  altText
                }
                images {
                  edges {
                    node {
                      url(width:400)
                      altText
                    }
                  }
                }
                prices {
                  price {
                    value
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      
        `,
      variables: {
        entityId: parseInt(entityId?.toString() ?? ''),
      },
    }),
  }).then(a => a.json())

  console.log(response)

  if (response.errors) {
    return res.status(500).json(response.errors)
  }

  res.status(200).json(response)
}
