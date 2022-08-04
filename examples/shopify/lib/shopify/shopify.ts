const DEFAULT_PRODUCT_ID = "7787289870593";

const shop = process.env.SHOPIFY_SHOP;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function getProducts() {
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
    console.error(response.errors);
    throw new Error("Error while fetching product");
  }

  return response.data;
}

export async function getProduct(id = DEFAULT_PRODUCT_ID) {
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
      body: `query {
        product(id: "gid://shopify/Product/${id}") {
          id
          title
          images(first: 4) {
            edges {
              node {
                id
                url
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
            }
          }
        }
      }`,
    }
  ).then((res) => res.json());

  if (response.errors) {
    console.error(response.errors);
    throw new Error("Error while fetching product");
  }

  return response.data;
}
