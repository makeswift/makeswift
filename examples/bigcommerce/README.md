# Demo

[https://makeswift-examples-bigcommerce.vercel.app](https://makeswift-examples-bigcommerce.vercel.app)

# Visually build with BigCommerce components

In this example, you will learn how to integrate [BigCommerce](https://www.bigcommerce.com/) with [Makeswift](https://www.makeswift.com) to create a visually editable ecommerce store.

This example includes a home page for listing products by category and a product template page for showing product details.

## Tools

- [**BigCommerce StoreFrontAPI**](https://developer.bigcommerce.com/docs/8138e27e79662-graph-ql-storefront-api-overview): to pull data related to a store in BigCommerce and provide it via React context.
- [**Makeswift SDK**](https://www.makeswift.com/docs): to register components into Makeswift's visual builder.

---

## Using this example

To quickly try this example either [deploy to Vercel](#deploy-this-example-to-vercel) or [use our CLI](#use-this-example-locally-with-the-makeswift-cli).

If you have already created a BigCommerce store and know you want to use this example, scroll down to ["Using your own BigCommerce store."](#using-your-own-bigcommerce-store)

### Deploy this example to Vercel

The deploy link below includes integrations with BigCommerce and Makeswift.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fbigcommerce&project-name=bigcommerce-makeswift-example&repo-name=bigcommerce-makeswift-example&redirect-url=https%3A%2F%2Fapp.makeswift.com&integration-ids=oac_51ryd7Pob5ZsyTFzNzVvpsGq,oac_MuWZiE4jtmQ2ejZQaQ7ncuDT&external-id=ecommerce-bigcommerce)

> **Note**
> During the Makeswift integration we recommend using the the "Ecommerce - BigCommerce" template. It comes prefilled with ecommerce components.

With your deployment completed, [take a tour of your ecommerce store](#take-a-tour-of-your-ecommerce-store)

### Use this example locally with the Makeswift CLI

1. Run the Makeswift CLI command

   ```bash
   npx makeswift@latest init --template=ecommerce-bigcommerce
   ```

   Note: the `--template=ecommerce-bigcommerce` above will auto-select the "Ecommerce - Bigcommerce" template in Makeswift and download this example Next.js store to your local machine.

2. Log in or sign up for Makeswift

3. Confirm the default env vars provided

Once completed, the CLI runs `yarn dev` and opens Makeswift for you. From there you can use provided custom ecommerce components.

### Take a tour of your ecommerce store

After integration, you will be redirected to app.makeswift.com.

- Navigate to the "Home" page on the left to test out the custom "Header" and "Product list" components

  - The "Header" is a functional cart integrated with the BigCommerce API
  - The "Product list" is a list of products from BigCommerce. To customize the category or number of visible products, select the "Product list" and update the panels to the right labeled 'Category' and 'Count' respectively.

- Then, go to the "\_\_product\_\_" page and test out the product-specific components

  - This page is also called the product template page because it is the template structure for all product pages.
  - The "Add to cart" is a functional button integrated with the BigCommerce API
  - All the other components — Product price, Product name, Product images, Product description, and Product breadcrumbs — are composable for creating a custom product page.

## Using your own BigCommerce store

Once you have given the example a try it's time to use your own BigCommerce store. Here is [a guide](https://support.bigcommerce.com/s/article/Starting-a-BigCommerce-Trial) on how to set one up.

Note: the env for this example corresponds to the [Vercel Commerce BigCommerce example](https://github.com/vercel/commerce/tree/main/packages/bigcommerce).

### How to get the environment variables from your store:

- `BIGCOMMERCE_STORE_API_TOKEN` requires an [API account](https://support.bigcommerce.com/s/article/Store-API-Accounts?language=en_US)

  - This token needs modify rights on Cart, Checkout, and storefront API Tokens, and read rights on Products and Content.
  - The "Access Token" created is the value that is used as `BIGCOMMERCE_STORE_API_TOKEN`

- `BIGCOMMERCE_STORE_API_URL`

  - An ID can be found in the URL of your BigCommerce dashboard
    ![BigCommerce Store API URL](https://user-images.githubusercontent.com/20950876/199331796-06b8b86f-5891-4344-9589-b02e78fd34f1.png)
  - This ID should be inserted into `https://api.bigcommerce.com/stores/<ID>`
  - Since the example ID is "uvhswop3wh" the example storefront API URL is (`https://api.bigcommerce.com/stores/uvhswop3wh`)

- `BIGCOMMERCE_CHANNEL_ID`

  - The channel ID can be found by going to "Channel Manager" and clicking "Edit settings" on the channel you want to use. It's the number in the URL after `channel/`.
    ![BigCommerce Channel ID](https://user-images.githubusercontent.com/20950876/199548296-92746bb6-17fc-4caa-b24a-a3c25ab89389.png)
  - Channel ID of `1` is autogenerated for all stores.

- `BIGCOMMERCE_STOREFRONT_API_URL`

  - A storefront API URL is the [href](https://developer.mozilla.org/en-US/docs/Web/API/URL/href) your BigCommerce dashboard + `/graphql`
    ![BigCommerce Storefront API URL](https://user-images.githubusercontent.com/20950876/199331779-7a27631a-1035-40d9-9df6-40217cd14e06.png)
  - Since the example dashboard is found at `https://store-uvhswop3wh.mybigcommerce.com/` the example storefront API URL is `https://store-uvhswop3wh.mybigcommerce.com/graphql`

- `BIGCOMMERCE_STOREFRONT_API_TOKEN`

  - The storefront API token is a JWT. Use [this endpoint](https://developer.bigcommerce.com/api-reference/044bc7b21e5b4-create-a-token) to create it. More details can be found [here](https://developer.bigcommerce.com/api-reference/35bac0e4eda61-graph-ql-storefront-api#request-tokens-with-rest-api)

  The example store token was created like so:

  ```bash
  curl -H "X-Auth-Token: 5lw9ulikcp186tjgg3rs39kh4fg3vci" -H "Content-Type: application/json" -X POST -d '{"channel_id":1,"expires_at":1982692202}' https://api.bigcommerce.com/stores/uvhswop3wh/v3/storefront/api-token
  ```

### How to add localization information to your store:

BigCommerce doesn't support localization as a first-class feature. This example uses the `metafields` [api](https://developer.bigcommerce.com/api-reference/1fc3689311c97-create-metafields) to store translations for each locale. `Metafields` are only accessible via API. This section will show you how to use the management API to add product translations.

Managing `metafields` with the Management API requires an [API account](https://support.bigcommerce.com/s/article/Store-API-Accounts?language=en_US) with product "modify" permissions. This API account should be different than the one used to deploy your site.

<figure style="margin-bottom:20px">
    <img width="286" alt="CleanShot 2022-12-06 at 16 28 49@2x" src="https://user-images.githubusercontent.com/20950876/206038013-62e02a0d-ae50-404b-be18-80c895128b82.png">
    <figcaption>the permission required to modify `metafields`</figcaption>
</figure>

Once you have created the new API account you can use it with the curl commands below.

> **Note**
> Don't forget to replace the PRODUCT_MODIFY_BIGCOMMERCE_STORE_API_TOKEN with the "Access Token" from creating your API account above.

#### Creating locale `metafields` for a product

To create a `metafield` you will need a `permission_set`, a `namespace`, a `key`, and a `value`.

- `permission_set`
  - This determines what APIs have access to this `metafield`. Since we query product data from the storefront API, we will need the `read_and_sf_access` `permission_set`.
- `namespace`
  - This indicates the locale that this `metafield` belongs to. In our situation, it should match the identifier this translation belongs to.
  - A translation to Spanish would go under the `es` namespace.
- `key`
  - The property in our product that this translation corresponds to.
- `value`
  - The translated text itself.

Here is an example of how we translated the values in our plant store. Blue Lily is Lirio Azul in Spanish.
To add the `metafield` for this translation I used the `namespace` of "es", the `key` of "name", and the `value` of "Lirio Azul".

```bash
curl -X POST https://api.bigcommerce.com/stores/uvhswop3wh/v3/catalog/products/114/metafields \
   -H 'Content-Type: application/json' \
   -H 'X-Auth-Token: PRODUCT_MODIFY_BIGCOMMERCE_STORE_API_TOKEN'\
   -d '{"permission_set":"read_and_sf_access","namespace":"es","key":"name","value":"Lirio Azul"}'
```

#### Deleting locale `metafields`

If you make a mistake when adding a `metafield`, this curl command can be used to delete the mistaken `metafield`. Note the different HTTP method and `metafield` id at the end of the URL.

```bash
curl -X DELETE https://api.bigcommerce.com/stores/uvhswop3wh/v3/catalog/products/114/metafields/24 \
   -H 'X-Auth-Token: PRODUCT_MODIFY_BIGCOMMERCE_STORE_API_TOKEN'
```

### Updating the deployed host on Vercel

If you clicked the "Deploy" button earlier you can change the environment variable in vercel.com

   <img src="https://user-images.githubusercontent.com/20950876/201372509-5e48b4ed-df3b-423e-98ef-cf41cd1ee5a6.png" width="600" />

### Updating the locally running host

If you started out with the CLI you can update the generated `.env.local` with any new values from your BigCommerce store.

The example store `.env.local` looks like:

```
MAKESWIFT_SITE_API_KEY=XXX-XXX-XXX

BIGCOMMERCE_STORE_API_TOKEN=5lw9ulikcp186tjgg3rs39kh4fg3vci
BIGCOMMERCE_STORE_API_URL=https://api.bigcommerce.com/stores/uvhswop3wh
BIGCOMMERCE_STOREFRONT_API_URL=https://store-uvhswop3wh.mybigcommerce.com/graphql
BIGCOMMERCE_STOREFRONT_API_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cHM6Ly9tYWtlc3dpZnQtZXhhbXBsZS5teWJpZ2NvbW1lcmNlLmNvbSJdLCJlYXQiOjE2Njc5MzI1MTUsImlhdCI6MTY2NzMyNzcxNSwiaXNzIjoiQkMiLCJzaWQiOjEwMDI1OTU3MTAsInN1YiI6Ijlzem1mc2txeWRmdXc5MnkwajYyZjkxYXQ1bnAzdHciLCJzdWJfdHlwZSI6MiwidG9rZW5fdHlwZSI6MX0.X4A2EWh05-baaG5do_or3mEJgQbmg2pMNg4kLLadWp0ywmzqYI3piExNxSbVgOnvzG5U9gxOKCZsOVPeh0mzfA"
```

If you are struggling to configure these env vars feel free to reach out in our [Discord](https://discord.com/invite/7dDpz6y) and we will be happy to help!

---

## Putting it all together

It's probably a good time to explain what's going on. Here is a point of reference for the technical terms below:

- "dynamic product route"
  - This is the Next.js page that creates product pages based on BigCommerce products and our Makeswift template layout
  - It can be found here: `/pages/product/[slug].tsx`
  - Here is [more info on dynamic routes](https://nextjs.org/docs/routing/dynamic-routes)
- "optional catch all route"
  - This is the Next.js page that creates pages based on pages in your Makeswift site
  - It can be found here : `/pages/[[...path]].tsx`
  - Here is [more info on optional catch all routes](https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes)

### How is BigCommerce product data getting to components?

The "optional catch all route" uses Next.js' `getStaticProps` to get a page snapshot from Makeswift.

```tsx
const makeswift = new Makeswift(config.makeswift.siteApiKey)
const path = '/' + (ctx.params?.path ?? []).join('/')
const snapshot = await makeswift.getPageSnapshot(path, {
  preview: ctx.preview,
})
```

It also uses `getStaticProps` to get product data from BigCommerce.

```tsx
const products = await getProducts()
```

Both Makeswift and BigCommerce data is then passed into the Page component via props.

```tsx
return { props: { snapshot, products } }
```

And we wrap the `MakeswiftPage` with a context provider for our BigCommerce data

```tsx
export default function Page({ products, snapshot }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <MakeswiftPage snapshot={snapshot} />
    </ProductsContext.Provider>
  )
}
```

### How are product pages being generated from the template (`/__product__`) route?

The "dynamic product route" uses Next.js' `getStaticPaths` API to generate page slugs from BigCommerce products.

```tsx
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const products = await getProducts()

  return {
    paths: products.map(product => ({ params: { slug: product.entityId.toString() } })),
    fallback: 'blocking',
  }
}
```

The resulting pages use the same makeswift data from the template (`/__product__`) makeswift page.

```tsx
const makeswift = new Makeswift(config.makeswift.siteApiKey)
const snapshot = await makeswift.getPageSnapshot(config.makeswift.productTemplatePathname, {
  preview: ctx.preview,
})
```

While dynamically pulling different products from BigCommerce based on the slug.

```tsx
const slug = ctx.params?.slug

/* ... */

const product = await getProduct(Number.parseInt(slug.toString(), 10))
```

### Why is the "dynamic product route" using a low revalidation period when the "optional catch all route" is using on-demand revalidation?

Pages are created in the "optional catch all route" based on pages in a Makeswift site. Since Makeswift is aware of what pages are published it can use [on-demand revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation) with an api route in `/pages/api/makeswift/[...makeswift].ts` to rebuild pages on publish

Unlike the "optional catch all route", the "dynamic product route" creates pages based on BigCommerce products. These routes are unknown to Makeswift and thus it doesn't revalidate them on-demand. Instead, we use a low revalidation period to update them.

### Why are cart API requests routed through `/page/api/[checkout|cart]`?

At the time of making this example the BigCommerce Storefront API is readonly and doesn't include cart mutations. In order to keep the `BIGCOMMERCE_ACCESS_TOKEN` private we are proxying all BigCommerce Management requests through `/page/api/[checkout|cart]`

More details on managing carts on a custom storefront can be found [here](https://developer.bigcommerce.com/docs/ZG9jOjE4MjIyNjUx-managing-carts).

---

## Next steps

With Makeswift, you can give your marketing team hand-crafted, ecommerce building blocks to create a custom store.

To learn more about Makeswift, take a look at the following resources:

- [Makeswift Website](https://www.makeswift.com/)
- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Discord Community](https://discord.gg/dGNdF3Uzfz)

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
