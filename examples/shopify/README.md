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

1. **Create a site in Makeswift and a shop in Shopify**

   Head over to [Makeswift](https://app.makeswift.com) and sign up for a free account. Create a site using the option to "Integrate with Next.js",
   and copy the Site API key. You will need it in step 3.

   Then head over to [Shopify](https://www.shopify.com/) and create a store. Here is [a good starting point](https://www.shopify.com/online) to get you started.

   Note: If you are just trying trying out Makeswift with our e-commerce template feel free use this example store and the read-only access token for your development.

   ```
   NEXT_PUBLIC_SHOPIFY_STORE_NAME=makeswift-example
   NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=b434d672242174f77e306910462c3d67
   ```

   Note 2: This custom storefront example assumes all products are in stock, so make sure all products have "Track quantity" unchecked as pictured below.

      <img width="600" src="https://user-images.githubusercontent.com/20950876/187238713-22fd0c65-8d9b-4eab-b94e-1e498053f270.png">

2. **Clone this template**

   Instead of using `create-next-app`, run this command from the terminal:

   ```bash
   npx degit makeswift/makeswift/examples/shopify shopify
   cd shopify
   ```

   It will download this subdirectory of the `makeswift/makeswift` repo without including git history.

3. **Update environment variables**

   Rename `.env.local.example` to `.env.local` and update it with values from your Shopify and Makeswift accounts.

   - `SHOPIFY_STORE_NAME` can be found in the Shopify dashboard

       <img src="https://user-images.githubusercontent.com/20950876/184916524-667084c1-06a0-4fa3-8f4b-73aff5a88e65.png" width="600" />

   - `SHOPIFY_ACCESS_TOKEN` requires you to [register an app](https://www.shopify.com/partners/blog/17056443-how-to-generate-a-shopify-api-token)
   - and finally the `MAKESWIFT_SITE_API_KEY` comes from your Makeswift site. It is the value you copied from step 1.

   ```diff
   - SHOPIFY_STORE_NAME=
   - SHOPIFY_ACCESS_TOKEN=

   - MAKESWIFT_SITE_API_KEY=
   + SHOPIFY_STORE_NAME=<YOUR_SHOPIFY_STORE_NAME>
   + SHOPIFY_ACCESS_TOKEN=<YOUR_SHOPIFY_ACCESS_TOKEN>

   + MAKESWIFT_SITE_API_KEY=<YOUR_MAKESWIFT_SITE_API_KEY>
   ```

4. **Start the dev server**

   Run this command from the terminal:

   ```bash
   yarn dev
   ```

   Your Next.js app should be up and running at http://localhost:3000.

5. **Create a home page with a list of products**

   1. Create a blank page

      Look for the plus button in the left toolbar and specify "Blank page".

   2. Edit the page's URL to be `/`

      Hover over the "Untitled page" you just created, click on the ellipsis that appears, and click "Edit URL".

   3. Drop in the Product list component

      Look for the ellipsis menu in the left toolbar and drop the Product list component into Makeswift.

      With the Product list component selected, update the category you want to display and the number of products in the right panels labeled 'Category' and 'Count' respectively.

6. **Create a product page template with product specific details**

   1. Create a blank page

      Look for the plus button in the left toolbar and specify "Blank page."

   2. Edit page's URL to be `/__product__`

      Hover over the "Untitled page" you just created, click on the ellipsis that appears, and click "Edit URL".

      You should set this value to the `productTemplatePathname` from `/lib/config.ts` which comes predefined in this template as `/__product__`.

   3. Drop in Product specific components

      Look for the ellipsis menu in the left toolbar again and drop the Product price, Product name, and Add to cart button into Makeswift.

---

## Putting it all together

With a home page and product template pages created it's probably a good time to explain what's going on.

### How is Shopify product data getting to components?

The `/pages/[[...path]].tsx` route uses Next.js' `getStaticProps` to get page data from Makeswift.

```tsx
const makeswiftResult = await makeswiftGetStaticProps(ctx)
```

It also uses `getStaticProps` to get product data from Shopify.

```tsx
const products = await getProducts()
const product = await getProduct()
```

Both Makeswift and Shopify data is then passed into the Page component via props.

```tsx
return {
  ...makeswiftResult,
  props: { ...makeswiftResult.props, products, product },
}
```

And exposed to components via context in `/pages/_app.tsx`.

```tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProductsContext.Provider value={pageProps.products}>
      <ProductContext.Provider value={pageProps.product}>
        <Component {...pageProps} />
      </ProductContext.Provider>
    </ProductsContext.Provider>
  )
}
```

### How are product pages being generated from the template (`/__product__`) route?

The `/pages/product/[slug].tsx` route uses Next.js' `getStaticPaths` api to generate page slugs from Shopify products.

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
const makeswiftResult = await makeswiftGetStaticProps({
  ...ctx,
  params: {
    ...ctx.params,
    path: config.makeswift.productTemplatePathname.replace(/^\//, '').split('/'),
  },
})
```

While dynamically pulling different products from Shopify based on the slug.

```tsx
const slug = ctx.params?.slug

/* ... */

const product = await getProduct(Number.parseInt(slug.toString(), 10))
```

---

## Next steps

With Makeswift, you can give your marketing team hand-crafted, ecommerce building blocks to create a custom store.

To learn more about Makeswift, take a look at the following resources:

- [Makeswift Website](https://www.makeswift.com/)
- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Discord Community](https://discord.gg/dGNdF3Uzfz)

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
