# Demo

[https://makeswift-examples-bigcommerce.vercel.app](https://makeswift-examples-bigcommerce.vercel.app)

# Visually build with BigCommerce components

In this example, you will learn how to integrate [BigCommerce](https://www.bigcommerce.com/) with [Makeswift](https://www.makeswift.com) to create a visually editable ecommerce store.

This example includes a home page for listing products by category and a product template page for including all the details.

## Tools

- [**BigCommerce StoreFrontAPI**](https://developer.bigcommerce.com/docs/8138e27e79662-graph-ql-storefront-api-overview): to pull data related to a store in BigCommerce and provide it via React context.
- [**Makeswift SDK**](https://www.makeswift.com/docs): to register components into Makeswift's visual builder.

---

## Deploy your own

Deploy your own with [Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fbigcommerce&env=MAKESWIFT_SITE_API_KEY,BIGCOMMERCE_STORE_NAME,BIGCOMMERCE_STORE_HASH,BIGCOMMERCE_ACCESS_TOKEN&envDescription=Check%20step%203%20of%20the%20example%20README.md%20for%20details%20on%20where%20to%20find%20these%20values.&envLink=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fbigcommerce%23using-this-repo&project-name=makeswift-bigcommerce-example&repository-name=makeswift-bigcommerce-example) or preview live with [StackBlitz](https://stackblitz.com/github/makeswift/makeswift/tree/main/examples/bigcommerce)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fbigcommerce&env=MAKESWIFT_SITE_API_KEY,BIGCOMMERCE_STORE_NAME,BIGCOMMERCE_STORE_HASH,BIGCOMMERCE_ACCESS_TOKEN&envDescription=Check%20step%203%20of%20the%20example%20README.md%20for%20details%20on%20where%20to%20find%20these%20values.&envLink=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fbigcommerce%23using-this-repo&project-name=makeswift-bigcommerce-example&repository-name=makeswift-bigcommerce-example)

Note: If you are just trying out Makeswift with our e-commerce template feel free use this example store and the read-only access token for your deployment.

```
BIGCOMMERCE_STORE_NAME=makeswift-example
BIGCOMMERCE_STORE_HASH=uvhswop3wh
BIGCOMMERCE_ACCESS_TOKEN=5lw9ulikcp186tjgg3rs39kh4fg3vci
```

---

## Using this repo

1. **Create a site in Makeswift and a shop in BigCommerce**

   Head over to [Makeswift](https://app.makeswift.com) and sign up for a free account. Create a site using the option to "Integrate with Next.js",
   and copy the Site API key. You will need it in step 3.

   Then head over to [BigCommerce](https://www.bigcommerce.com/) and create a store. Here is [a guide](https://support.bigcommerce.com/s/article/Starting-a-Bigcommerce-Trial) to get you started.

   Note: If you are just trying out Makeswift with our e-commerce template feel free use this example store and the read-only access token for your development.

   ```
   BIGCOMMERCE_STORE_NAME=makeswift-example
   BIGCOMMERCE_STORE_HASH=uvhswop3wh
   BIGCOMMERCE_ACCESS_TOKEN=5lw9ulikcp186tjgg3rs39kh4fg3vci
   ```

2. **Clone this template**

   Instead of using `create-next-app`, run this command from the terminal:

   ```bash
   npx degit makeswift/makeswift/examples/bigcommerce bigcommerce
   cd bigcommerce
   ```

   It will download this subdirectory of the `makeswift/makeswift` repo without including git history.

3. **Update environment variables**

   Rename `.env.local.example` to `.env.local` and update it with values from your BigCommerce and Makeswift accounts.

   - `BIGCOMMERCE_STORE_NAME` and `BIGCOMMERCE_STORE_HASH` can be found in the BigCommerce dashboard

       <img src="https://user-images.githubusercontent.com/20950876/184250701-c7af5854-ad4a-4dec-b8e1-1653cddbff1c.png" width="600" />

   - `BIGCOMMERCE_ACCESS_TOKEN` requires you to [create an API account](https://support.bigcommerce.com/s/article/Store-API-Accounts?language=en_US)
   - and finally the `MAKESWIFT_SITE_API_KEY` comes from your Makeswift site. It is the value you copied from step 1.

   ```diff
   - BIGCOMMERCE_STORE_NAME=
   - BIGCOMMERCE_STORE_HASH=
   - BIGCOMMERCE_ACCESS_TOKEN=

   - MAKESWIFT_SITE_API_KEY=
   + BIGCOMMERCE_STORE_NAME=<YOUR_BIGCOMMERCE_STORE_NAME>
   + BIGCOMMERCE_STORE_HASH=<YOUR_BIGCOMMERCE_STORE_HASH>
   + BIGCOMMERCE_ACCESS_TOKEN=<YOUR_BIGCOMMERCE_ACCESS_TOKEN>

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

### How is BigCommerce product data getting to components?

The `/pages/[[...path]].tsx` route uses Next.js' `getStaticProps` to get page data from Makeswift.

```tsx
const makeswiftResult = await makeswiftGetStaticProps(ctx)
```

It also uses `getStaticProps` to get product data from BigCommerce.

```tsx
const products = await getProducts()
const product = await getProduct()
```

Both Makeswift and BigCommerce data is then passed into the Page component via props.

```tsx
return { ...makeswiftResult, props: { ...makeswiftResult.props, products, product } }
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

The `/pages/product/[slug].tsx` route uses Next.js' `getStaticPaths` api to generate page slugs from BigCommerce products.

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
const makeswiftResult = await makeswiftGetStaticProps({
  ...ctx,
  params: {
    ...ctx.params,
    path: config.makeswift.productTemplatePathname.replace(/^\//, '').split('/'),
  },
})
```

While dynamically pulling different products from BigCommerce based on the slug.

```tsx
const slug = ctx.params?.slug

/* ... */

const product = await getProduct(Number.parseInt(slug.toString(), 10))
```

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
