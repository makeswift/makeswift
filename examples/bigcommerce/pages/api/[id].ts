// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!process.env.ACCESS_TOKEN) {
    console.error({ env: process.env })
    throw new Error('You need ACCESS_TOKEN in your env')
  }

  const twentyThirtyInSeconds = 1912037490

  const response = await fetch(
    `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/storefront/api-token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': process.env.ACCESS_TOKEN,
      },
      body: JSON.stringify({
        channel_id: 1,
        expires_at: twentyThirtyInSeconds,
        allowed_cors_origins: ['https://makeswift-example.mybigcommerce.com'],
      }),
    },
  ).then(a => a.json())
  console.log(response.data.token)

  const result = await fetch('https://makeswift-example.mybigcommerce.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + response.data.token,
    },
    body: JSON.stringify({
      query: `


      query paginateProducts(
        $pageSize: Int = 6
        $cursor: String
        # Use GraphQL variables to change the page size, or inject the endCursor as "cursor"
        # to go to the next page!
      ) {
        site {
          products (first: $pageSize, after: $cursor) {
            pageInfo {
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
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
                  retailPrice {
                    value
                    currencyCode
                  }
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
        cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
      },
    }),
  }).then(a => a.json())
  console.log(result)

  res.status(200).json(result)
}
