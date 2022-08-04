import { NextApiRequest, NextApiResponse } from "next";

type Data = any;

const shop = process.env.SHOPIFY_SHOP;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (shop == null) {
    throw new Error("SHOPIFY_SHOP env variable is needed");
  }

  if (storefrontAccessToken == null) {
    throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN env variable is needed");
  }

  const response = await fetch(
    `https://${shop}.myshopify.com/api/2022-07/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: `{
        products(first: 9) {
          edges {
            node {
              id
              title
              featuredImage {
                id
                url
              }
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              images(first: 3) {
                edges {
                  node {
                    id
                    url
                  }
                }
              }
            }
          }
        }
      }`,
    }
  ).then((res) => res.json());

  if (response.errors) {
    return res.status(500).json(response.errors);
  }

  res.status(200).json(response.data);
}
