# Demo

[https://makeswift-examples-shopify.vercel.app](https://makeswift-examples-shopify.vercel.app)

# Visually build with Shopify components

In this example, you will learn how to integrate [Shopify](https://www.shopify.com/) with [Makeswift](https://www.makeswift.com) to create a visually editable ecommerce store.

This example includes a home page for listing products by category and a product template page for including all the details.

## Tools

- [**Shopify StoreFrontAPI**](https://shopify.dev/api/storefront): to pull data related to a store in Shopify and provide it via React context.
- [**Makeswift SDK**](https://www.makeswift.com/docs): to register components into Makeswift's visual builder.

---

## Using this example

To quickly try this example either [deploy to Vercel](#deploy-this-example-to-vercel) or [use our CLI](#use-this-example-locally-with-the-makeswift-cli).

If you have already created a Shopify store and know you want to use this example, scroll down to ["Using your own Shopify store."](#using-your-own-shopify-store)

### Deploy this example to Vercel

Deploy your own with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fshopify&env=NEXT_PUBLIC_SHOPIFY_STORE_NAME,NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN&envDescription=Check%20the%20example%20README.md%20for%20details%20on%20where%20to%20find%20these%20values.&envLink=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fshopify%23using-your-own-shopify-store&project-name=makeswift-shopify-example&repo-name=makeswift-shopify-example&redirect-url=https%3A%2F%2Fapp.makeswift.com&integration-ids=oac_51ryd7Pob5ZsyTFzNzVvpsGq)

Note: We have created an example store, so no Shopify account is required.

```
NEXT_PUBLIC_SHOPIFY_STORE_NAME=makeswift-example
NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=b434d672242174f77e306910462c3d67
```

With your deployment completed, [take a tour of your ecommerce store](#take-a-tour-of-your-ecommerce-store)

### Use this example locally with the Makeswift CLI

1. Run the Makeswift CLI command

   ```bash
   npx makeswift@latest init --template=ecommerce-shopify
   ```

   Note: the `--template=ecommerce-shopify` above will auto-select the "Ecommerce - Shopify" template in Makeswift and download this example Next.js store to your local machine.

2. Log in or sign up for Makeswift

3. Confirm the default env vars provided

Once completed, the CLI runs `yarn dev` and opens Makeswift for you. From there you can use provided custom ecommerce components.

### Take a tour of your ecommerce store

After integration, you will be redirected to app.makeswift.com.

- Navigate to the "Home" page on the left to test out the custom "Header" and "Product list" components

  - The "Header" is a functional cart integrated with the Shopify API
  - The "Product list" is a list of products from Shopify. To customize the collection or number of visible products, select the "Product list" and update the panels to the right labeled 'Collection' and 'Count' respectively.

- Then, go to the "\_\_product\_\_" page and test out the product-specific components

  - This page is also called the product template page because it is the template structure for all product pages.
  - The "Add to cart" is a functional button integrated with the Shopify API
  - All the other components — Product price, Product name, Product images, Product description, and Product breadcrumbs — are composable for creating a custom product page.

## Using your own Shopify store

Once you have given the example a try it's time to use your own Shopify store. Head over to [Shopify](https://www.shopify.com/) and create a store. Here is [a good starting point](https://www.shopify.com/online).

> **Note**
> This custom storefront example assumes all products are in stock, so make sure all products have "Track quantity" unchecked as pictured below.

<img width="600" src="https://user-images.githubusercontent.com/20950876/187238713-22fd0c65-8d9b-4eab-b94e-1e498053f270.png">

### How to get the environment variables from your store:

- `SHOPIFY_STORE_NAME` can be found in the Shopify dashboard

    <img src="https://user-images.githubusercontent.com/20950876/184916524-667084c1-06a0-4fa3-8f4b-73aff5a88e65.png" width="600" />

- `SHOPIFY_ACCESS_TOKEN` requires you to [register an app](https://www.shopify.com/partners/blog/17056443-how-to-generate-a-shopify-api-token)

### Updating the deployed host on Vercel

If you clicked the "Deploy" button earlier you can change the environment variable in vercel.com

   <img src="https://user-images.githubusercontent.com/20950876/201371948-2258365c-18bb-4891-9d9f-26a66b2b3745.png" width="600" />

### Updating the locally running host

If you started out with the CLI you can update the generated `.env.local` with any new values from your Shopify store.

The example store `.env.local` looks like:

```
MAKESWIFT_SITE_API_KEY=XXX-XXX-XXX

NEXT_PUBLIC_SHOPIFY_STORE_NAME=makeswift-example
NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=b434d672242174f77e306910462c3d67
```

If you are struggling to configure these env vars feel free to reach out in our [Discord](https://discord.com/invite/7dDpz6y) and we will be happy to help!

---

## Putting it all together

It's probably a good time to explain what's going on. Here is a point of reference for the technical terms below:

- "dynamic product route"
  - This is the Next.js page that creates product pages based on Shopify products and our Makeswift template layout
  - It can be found here: `/pages/product/[slug].tsx`
  - Here is [more info on dynamic routes](https://nextjs.org/docs/routing/dynamic-routes)
- "optional catch all route"
  - This is the Next.js page that creates pages based on pages in your Makeswift site
  - It can be found here : `/pages/[[...path]].tsx`
  - Here is [more info on optional catch all routes](https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes)

### How is Shopify product data getting to components?

The "optional catch all route" uses Next.js' `getStaticProps` to get a page snapshot from Makeswift.

```tsx
const makeswift = new Makeswift(config.makeswift.siteApiKey)
const path = '/' + (ctx.params?.path ?? []).join('/')
const snapshot = await makeswift.getPageSnapshot(path, {
  preview: ctx.preview,
})
```

It also uses `getStaticProps` to get product data from Shopify.

```tsx
const products = await getProducts()
```

Both Makeswift and Shopify data is then passed into the Page component via props.

```tsx
return { props: { snapshot, products } }
```

And we wrap the `MakeswiftPage` with a context provider for our Shopify data

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

The "dynamic product route" uses Next.js' `getStaticPaths` API to generate page slugs from Shopify products.

```tsx
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const products = await getProducts()

  return {
    paths: products.map(product => ({
      params: { slug: product.entityId.toString() },
    })),
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

While dynamically pulling different products from Shopify based on the slug.

```tsx
const slug = ctx.params?.slug

/* ... */

const product = await getProduct(Number.parseInt(slug.toString(), 10))
```

### Why is the "dynamic product route" using a low revalidation period when the "optional catch all route" is using on-demand revalidation?

Pages are created in the "optional catch all route" based on pages in a Makeswift site. Since Makeswift is aware of what pages are published it can use [on-demand revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation) with an api route in `/pages/api/makeswift/[...makeswift].ts` to rebuild pages on publish

Unlike the "optional catch all route", the "dynamic product route" creates pages based on Shopify products. These routes are unknown to Makeswift and thus it doesn't revalidate them on-demand. Instead, we use a low revalidation period to update them.

---

## Next steps

With Makeswift, you can give your marketing team hand-crafted, ecommerce building blocks to create a custom store.

To learn more about Makeswift, take a look at the following resources:

- [Makeswift Website](https://www.makeswift.com/)
- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Discord Community](https://discord.gg/dGNdF3Uzfz)

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome.
