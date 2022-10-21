# Demo

[https://makeswift-examples-shopify.vercel.app](https://makeswift-examples-shopify.vercel.app)

# Visually build with Shopify components

In this example, you will learn how to integrate [Shopify](https://www.shopify.com/) with [Makeswift](https://www.makeswift.com) to create a visually editable ecommerce store.

This example includes a home page for listing products by category and a product template page for including all the details.

## Tools

- [**Shopify StoreFrontAPI**](https://shopify.dev/api/storefront): to pull data related to a store in Shopify and provide it via React context.
- [**Makeswift SDK**](https://www.makeswift.com/docs): to register components into Makeswift's visual builder.

---

## Deploy your own

Deploy your own with [Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fshopify&env=MAKESWIFT_SITE_API_KEY,NEXT_PUBLIC_SHOPIFY_STORE_NAME,NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN&envDescription=Check%20step%203%20of%20the%20example%20README.md%20for%20details%20on%20where%20to%20find%20these%20values.&envLink=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fshopify%23using-this-repo&project-name=makeswift-shopify-example&repository-name=makeswift-shopify-example) or preview live with [StackBlitz](https://stackblitz.com/github/makeswift/makeswift/tree/main/examples/shopify)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fshopify&env=MAKESWIFT_SITE_API_KEY,NEXT_PUBLIC_SHOPIFY_STORE_NAME,NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN&envDescription=Check%20step%203%20of%20the%20example%20README.md%20for%20details%20on%20where%20to%20find%20these%20values.&envLink=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fshopify%23using-this-repo&project-name=makeswift-shopify-example&repository-name=makeswift-shopify-example)

Note: If you are just trying trying out Makeswift with our e-commerce template feel free use this example store and the read-only access token for your deployment.

```
NEXT_PUBLIC_SHOPIFY_STORE_NAME=makeswift-example
NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=b434d672242174f77e306910462c3d67
```

## Using this repo

1. **Clone this template using the Makeswift CLI**

    ```bash
    npx makeswift@latest init \
        --example shopify \
        --env NEXT_PUBLIC_SHOPIFY_STORE_NAME=makeswift-example \
        --env NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=b434d672242174f77e306910462c3d67
    ```

2. **Create a home page with a list of products**

   1. Create a blank page

      Look for the plus button in the left toolbar and specify "Blank page".

   2. Edit the page's URL to be `/`

      Hover over the "Untitled page" you just created, click on the ellipsis that appears, and click "Edit URL".

   3. Drop in the Product list component

      Look for the ellipsis menu in the left toolbar and drop the Product list component into Makeswift.

      With the Product list component selected, update the category you want to display and the number of products in the right panels labeled 'Category' and 'Count' respectively.

3. **Create a product page template with product specific details**

   1. Create a blank page

      Look for the plus button in the left toolbar and specify "Blank page."

   2. Edit page's URL to be `/__product__`

      Hover over the "Untitled page" you just created, click on the ellipsis that appears, and click "Edit URL".

      You should set this value to the `productTemplatePathname` from `/lib/config.ts` which comes predefined in this template as `/__product__`.

   3. Drop in Product specific components

      Look for the ellipsis menu in the left toolbar again and drop the Product price, Product name, and Add to cart button into Makeswift.


## Using your own Shopify store


1. **Create a Shopify store**

   - Head over to [Shopify](https://www.shopify.com/) and create a store. Here is [a good starting point](https://www.shopify.com/online).

     > **Note**
     > This custom storefront example assumes all products are in stock, so make sure all products have "Track quantity" unchecked as pictured below.

     <img width="600" src="https://user-images.githubusercontent.com/20950876/187238713-22fd0c65-8d9b-4eab-b94e-1e498053f270.png">

2. **Get environment variables**

   - `SHOPIFY_STORE_NAME` can be found in the Shopify dashboard

       <img src="https://user-images.githubusercontent.com/20950876/184916524-667084c1-06a0-4fa3-8f4b-73aff5a88e65.png" width="600" />

   - `SHOPIFY_ACCESS_TOKEN` requires you to [register an app](https://www.shopify.com/partners/blog/17056443-how-to-generate-a-shopify-api-token)


3. **Run the Makeswift CLI**

    Either use our example values to use our example store, or use your own Shopify credentials.

    ```bash
    npx makeswift@latest init \
        --example shopify \
        --env NEXT_PUBLIC_SHOPIFY_STORE_NAME=<shopify-store-name> \
        --env NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=<shopify-access-token>
    ```

    If you've already run the CLI, and have a working Next.Js app with our Shopify store, then you can simply edit the `.env.local` file.

    Make sure you do steps 2 and 3 in the `Using this repo` section.



---

## Putting it all together

With a home page and product template pages created it's probably a good time to explain what's going on.

This explanation is loaded with technical terms. Here is a point of reference if you are unfamiliar:

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

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
