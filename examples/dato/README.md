# Makeswift Dato Integration

(Link to landing page):
https://makeswift-examples-basic-typescript.vercel.app/

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Using this example

To quickly try this example either [deploy to Vercel](#deploy-this-example-to-vercel) or [use our CLI](#use-this-example-locally-with-the-makeswift-cli).

In addition to your Makeswift API key, add your Dato API key in either `.env.local` or your environment variables in vercel.

`NEXT_PUBLIC_DATO_CMS_API_TOKEN=your_token`

---

### Deploy this example to Vercel

The deploy link below includes integrations with Dato and Makeswift.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fdato&project-name=dato-makeswift-example&repository-name=dato-makeswift-example&redirect-url=https%3A%2F%2Fapp.makeswift.com&integration-ids=oac_51ryd7Pob5ZsyTFzNzVvpsGq,oac_nsrwzogJLEFglVwt2060kB0y&external-id=dato-makeswift)

### Use this example locally with the Makeswift CLI

Set up this example of Makeswift by running

```bash
npx makeswift@latest init --example=dato
```

## Local Development

Run `pnpm codegen-ts` after copying the following Dato schema

![alt text](https://github.com/user-attachments/assets/8f235b4b-ed0f-4b99-a018-15ceaa56f1ac)

Note that the Structured Text type ("body") has a validation field under "Specify the blocks allowed" and "Image" in the combobox.

We recommend following the same schema because the `.graphql` files provided assume the same schema.

In order to start visually editing these components in your dynamic page, use the builder's URL bar to navigate directly to the route (i.e. `/blog/my-blog`). This page renders an embedded MakeswiftComponent that represents the Blog Page. You will then be able to use the following component that dynamically renders off the slug:

- `Blog/BlogRichText` which has controls to determine which RichText field to render. Should you extend the Blog schema to include more RichText fields, you will see them inside this dropdown. See `BlogRichText.makeswift.ts` for more information.

  ![alt text](https://github.com/user-attachments/assets/278fd44c-b4c0-4f29-a666-911798c4f5a1)

In addition to this we included `Blog/Feed` which queries all the blogs in Dato, renders them on the page, and paginates.

## Next steps

With Makeswift, you can give your marketing team hand-crafted, CMS building blocks to create a custom website.

To learn more about Makeswift, take a look at the following resources:

- [Makeswift Website](https://www.makeswift.com/)
- [Makeswift Documentation](https://www.makeswift.com/docs/)

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
