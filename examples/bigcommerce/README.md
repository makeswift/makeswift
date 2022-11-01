# Demo

[https://makeswift-examples-bigcommerce.vercel.app](https://makeswift-examples-bigcommerce.vercel.app)

# Visually build with BigCommerce components

In this example, you will learn how to integrate [BigCommerce](https://www.bigcommerce.com/) with [Makeswift](https://www.makeswift.com) to create a visually editable ecommerce store.

This example includes a home page for listing products by category and a product template page for including all the details.

## Tools

- [**BigCommerce StoreFrontAPI**](https://developer.bigcommerce.com/docs/8138e27e79662-graph-ql-storefront-api-overview): to pull data related to a store in BigCommerce and provide it via React context.
- [**Makeswift SDK**](https://www.makeswift.com/docs): to register components into Makeswift's visual builder.

---

## Using this example

To quickly try this example either deploy to Vercel or use our CLI. If you already have a Bigcommerce store and know you want to use this example scroll down to "Using your own BigCommerce store."

### Deploy your own on Vercel

The deploy link below includes integrations with BigCommerce and Makeswift to get you up in running quickly.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fbigcommerce&project-name=bigcommerce-makeswift-example&repo-name=bigcommerce-makeswift-example&redirect-url=https%3A%2F%2Fapp.makeswift.com&integration-ids=oac_51ryd7Pob5ZsyTFzNzVvpsGq,oac_MuWZiE4jtmQ2ejZQaQ7ncuDT)

---

### Using the Makeswift CLI

If you instead want to run the example locally we have created an example Bigcommerce store so you can do that easily.

1. Use this template with the Makeswift CLI

   ```bash
   npx makeswift@latest init \
      --example bigcommerce \
      --env BIGCOMMERCE_STORE_API_URL=https://api.bigcommerce.com/stores/uvhswop3wh \
      --env BIGCOMMERCE_STORE_API_TOKEN=5lw9ulikcp186tjgg3rs39kh4fg3vci \
      --env BIGCOMMERCE_STOREFRONT_API_URL="https://makeswift-example.mybigcommerce.com/graphql" \
      --env BIGCOMMERCE_STOREFRONT_API_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cHM6Ly9tYWtlc3dpZnQtZXhhbXBsZS5teWJpZ2NvbW1lcmNlLmNvbSJdLCJlYXQiOjE2Njc5MzI1MTUsImlhdCI6MTY2NzMyNzcxNSwiaXNzIjoiQkMiLCJzaWQiOjEwMDI1OTU3MTAsInN1YiI6Ijlzem1mc2txeWRmdXc5MnkwajYyZjkxYXQ1bnAzdHciLCJzdWJfdHlwZSI6MiwidG9rZW5fdHlwZSI6MX0.X4A2EWh05-baaG5do_or3mEJgQbmg2pMNg4kLLadWp0ywmzqYI3piExNxSbVgOnvzG5U9gxOKCZsOVPeh0mzfA"
   ```

2. When prompted log in or sign up for Makeswift and select the "Ecommerce" template. (It's at the end of the template page)

3. Once the CLI is done running, it runs `yarn dev` and opens Makeswift for you.

4. Go to the "Home" page and drop in the "Product list" component

   - The home page is in the left toolbar
   - Look for the ellipsis menu(again left toolbar) and drop the Product list component into Makeswift.

     With the Product list component selected, update the category you want to display and the number of products in the right panels labeled 'Category' and 'Count' respectively.

5. Go to the "\_\_product\_\_" page (also called the product template page) and drop in the product-specific components

   - The product template page is in the left toolbar
   - Look for the ellipsis menu(again left toolbar) and drop in the Product specific components

     These include the Product price, Product description, Product price, Product name, and Add to cart components.

## Using your own BigCommerce store

Once you have given the example a try it's time to use your own BigCommerce store. Here is [a guide](https://support.bigcommerce.com/s/article/Starting-a-BigCommerce-Trial) on how to set one up.

Note: the env for this example corresponds to the [Vercel Commerce BigCommerce example](https://github.com/vercel/commerce/tree/main/packages/bigcommerce).

### How to get the environment variables from your store:

- `BIGCOMMERCE_STORE_API_TOKEN` requires an [API account](https://support.bigcommerce.com/s/article/Store-API-Accounts?language=en_US)

  - This token needs modify rights on Cart, Checkout, and Storefront API Tokens, and read rights on Products and Content.
  - The "Access Token" created is the value that is used as `BIGCOMMERCE_STORE_API_TOKEN`

- `BIGCOMMERCE_STORE_API_URL`

  - An ID can be found in the URL of your BigCommerce dashboard
    ![CleanShot 2022-11-01 at 15 09 40@2x](https://user-images.githubusercontent.com/20950876/199331796-06b8b86f-5891-4344-9589-b02e78fd34f1.png)
  - This ID should be inserted into `https://api.bigcommerce.com/stores/<ID>` like "uvhswop3wh" is in our example store(`https://api.bigcommerce.com/stores/uvhswop3wh`)

- `BIGCOMMERCE_STOREFRONT_API_URL`

  - A StoreFront API URL is the [href](https://developer.mozilla.org/en-US/docs/Web/API/URL/href) your BigCommerce dashboard + `/graphql`
    ![CleanShot 2022-11-01 at 15 11 04@2x](https://user-images.githubusercontent.com/20950876/199331779-7a27631a-1035-40d9-9df6-40217cd14e06.png)
  - Since the example dashboard is found at `https://store-uvhswop3wh.mybigcommerce.com/` the example storefront API URL is `https://store-uvhswop3wh.mybigcommerce.com/graphql`

- `BIGCOMMERCE_STOREFRONT_API_TOKEN`

  - The StoreFront API token is a JWT. To create it use [this endpoint](https://developer.bigcommerce.com/api-reference/044bc7b21e5b4-create-a-token). More details can be found [here](https://developer.bigcommerce.com/api-reference/35bac0e4eda61-graph-ql-storefront-api#request-tokens-with-rest-api)

  For the example store I create this token like so:

  ```bash
  curl -H "X-Auth-Token: 5lw9ulikcp186tjgg3rs39kh4fg3vci" -H "Content-Type: application/json" -X POST -d '{"channel_id":1,"expires_at":1982692202}' https://api.bigcommerce.com/stores/uvhswop3wh/v3/storefront/api-token
  ```

### Updating the deployed host on Vercel

If you clicked the "Deploy" button earlier you can change the environment variable in vercel.com

   <img src="https://user-images.githubusercontent.com/7907782/197216891-93be5f0f-01f6-4a3d-8087-c3c2f9536545.png" width="600" />

### Updating the locally running host

If you started out with the CLI you can update the generated `.env.local` with any new values from your BigCommerce store.

For the example store this `.env.local` looks like:

```
MAKESWIFT_SITE_API_KEY=XXX-XXX-XXX

BIGCOMMERCE_STORE_API_TOKEN=5lw9ulikcp186tjgg3rs39kh4fg3vci
BIGCOMMERCE_STORE_API_URL=https://api.bigcommerce.com/stores/uvhswop3wh
BIGCOMMERCE_STOREFRONT_API_URL=https://store-uvhswop3wh.mybigcommerce.com/graphql
BIGCOMMERCE_STOREFRONT_API_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cHM6Ly9tYWtlc3dpZnQtZXhhbXBsZS5teWJpZ2NvbW1lcmNlLmNvbSJdLCJlYXQiOjE2Njc5MzI1MTUsImlhdCI6MTY2NzMyNzcxNSwiaXNzIjoiQkMiLCJzaWQiOjEwMDI1OTU3MTAsInN1YiI6Ijlzem1mc2txeWRmdXc5MnkwajYyZjkxYXQ1bnAzdHciLCJzdWJfdHlwZSI6MiwidG9rZW5fdHlwZSI6MX0.X4A2EWh05-baaG5do_or3mEJgQbmg2pMNg4kLLadWp0ywmzqYI3piExNxSbVgOnvzG5U9gxOKCZsOVPeh0mzfA"
```

If you are struggling to configure this env feel free to reach out in our [Discord](https://discord.com/invite/7dDpz6y) and we will be happy to help!

---

## Putting it all together

With a home page and product template pages created it's probably a good time to explain what's going on.

This explanation is loaded with technical terms. Here is a point of reference if you are unfamiliar:

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
