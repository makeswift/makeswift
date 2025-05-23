# Makeswift Contentful Integration

This integration allows you to combine the power of Contentful's content management with Makeswift's visual page builder. Create dynamic, content-rich websites with a seamless development experience.

For a detailed guide on setting up and using this integration, visit:
https://www.makeswift.com/integrations/contentful

## Prerequisites

- Node.js 18.x or later
- Makeswift account (for visual page building)
- Contentful account (for content management)
- Basic familiarity with Next.js App Router

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
contentful/
├── app/                   # Next.js App Router pages
│   ├── blog/              # Blog-related routes
│   ├── api/               # API endpoints
│   └── [[...path]]/       # Dynamic Makeswift routes
├── components/            # Reusable React components
├── lib/                   # Utility functions and configs
└── generated/             # Auto-generated types from Contentful
```

## Quick Start

### Option 1: Deploy to Vercel

The deploy link below includes integrations with Contentful and Makeswift:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fcontentful&project-name=contentful-makeswift-example&repository-name=contentful-makeswift-example&redirect-url=https%3A%2F%2Fapp.makeswift.com&integration-ids=oac_51ryd7Pob5ZsyTFzNzVvpsGq,oac_9z8CliUmYcKI8qoY0JtmSyzz&external-id=contentful-makeswift)

### Option 2: Local Development

1. Set up the project:

   ```bash
   npx makeswift@latest init --example=contentful
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables in `.env.local`:

   ```
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
   ```

4. Setting up Contentful
   To get started with blog posts, you'll need to set up a content model in Contentful. Here's what we recommend:

Create a new content type called "Author" with the following fields:

- **Name | Short text [Entry title]** - A short text field for the post title
- **Slug | Short text** - A URL-friendly identifier (e.g. "my-first-blog-post")
- **Job Title | Date & time** - When the post should appear in feed
- **Description | Rich text** - The main content as rich text
- **Avatar | Media type** - An optional hero image for the post

Create a new content type called "BlogPost" with the following fields:

- **Title | Short text [Entry title]** - A short text field for the post title
- **Description | long text** - A brief summary of the content
- **Slug | Short text** - A URL-friendly identifier (e.g. "my-first-blog-post")
- **Feed Date | Date & time** - When the post should appear in feed
- **Body | Rich text** - The main content as rich text
- **Author | Reference** - Which Author created the blog. Ensure that "Accept only specified entry type" is enabled in order to introspect this reference.
- **Banner | Media type** - An optional hero image for the post

Be sure to add a few blog posts for testing purposes, and connect them to an Author

4. Generate Contentful types:

   ```bash
   pnpm codegen-ts
   ```

Note that the only query we are working with is in `/components/Contentful/GetBlogs.graphql`

5. Run the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Building Blog Posts

1. Publish blog posts in Contentful with the same Content model.
2. Access them at `/blog/[slug]` by clicking on the Makeswift URL bar, and type `/blog/your-blog-slug`.
3. Use the Makeswift builder to customize the blog template.

### Blog Feed Component

The `Blog/BlogFeed` component (`components/Blog/BlogFeed.tsx`):

- Queries all blog posts from Contentful
- Handles pagination
- Can be embedded in any Makeswift page
- This is usually placed in the parent route `/blog`

### Contentful Components

The integration includes several pre-built components for working with Contentful content. These components are located in `components/Contentful/` and are organized into two main categories:

#### Common Components (`components/Contentful/common/`)

These are utility components that provide shared functionality for working with Contentful content.

#### Entry Components (`components/Contentful/entries/`)

These components are designed to work with specific Contentful content types:

1. **BlogPost Components**

   - `BlogPostText`: Renders short text fields belonging to blog posts
   - `BlogPostRichText`: Displays rich text content
   - `BlogPostImage`: Handles blog post images
   - `BlogPostFeed`: Shows a list of blog posts

2. **Author Components**
   - `AuthorText`: Renders short text fields for authors
   - `AuthorRichText`: Displays rich text content
   - `AuthorImage`: Handles blog post images
   - `AuthorFeed`: Shows a list of blog posts

An example of how to use the Blog components in Makeswift:

1. Navigate to your blog post or author page in the builder's URL bar (e.g., `/blog/my-blog` or `/author/the-author`)
2. In the Makeswift builder, drag the desired component onto your page
3. Use the component's combobox to select the corresponding GraphQL field you want to render -- e.g. `description`
4. The component will fetch and display the content from Contentful

For example, to display a blog post's text:

1. Drag the `BlogPostText` component onto your page -- ensure the route for your blog slug is correct
2. In the component controls, select the appropriate text field from the GraphQL query
3. The component will render the selected field's content

To display Author information:

1. Drag the `AuthorImage` component onto the page
2. Select from the combobox the appropriate GraphQL field
3. The component should now display the corresponding image

## Troubleshooting

Common issues and solutions:

1. **Type generation fails**

   - Ensure Contentful credentials are correct
   - Check if content model is published and matches what's being queried

2. **Blog posts not showing**

   - Verify the slug format matches the route pattern
   - Check if posts are published in Contentful

3. **Makeswift builder issues**
   - Clear browser cache
   - Ensure API keys are correctly set

## Next Steps

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Contentful API Reference](https://www.contentful.com/developers/docs/references/)
- [GitHub Repository](https://github.com/makeswift/makeswift)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## License

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
