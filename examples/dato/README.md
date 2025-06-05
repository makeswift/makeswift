# Makeswift Dato Integration

This integration allows you to combine the power of DatoCMS's content management with Makeswift's visual page builder. Create dynamic, content-rich websites with a seamless development experience.

For a detailed guide on setting up and using this integration, visit:
https://www.makeswift.com/integrations/dato

## Prerequisites

- Node.js 18.x or later
- Makeswift account (for visual page building)
- DatoCMS account (for content management)
- Basic familiarity with Next.js App Router

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

dato/
├── app/ # Next.js App Router pages
│ ├── blog/ # Blog-related routes
│ ├── api/ # API endpoints
│ └── [[...path]]/ # Dynamic Makeswift routes
├── components/ # Reusable React components
│ └── Dato/ # Contentful-specific components
│ ├── common/ # Common scalar components
│ ├── entries/ # Entry-specific components
│ │ └── BlogPost/ # BlogPost entry components
│ └── queries/ # GraphQL queries
├── lib/ # Utility functions and configs
└── generated/ # Auto-generated types from Dato

## Quick Start

### Option 1: Deploy to Vercel

The deploy link below includes integrations with DatoCMS and Makeswift:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmakeswift%2Fmakeswift%2Ftree%2Fmain%2Fexamples%2Fdato&project-name=dato-makeswift-example&repository-name=dato-makeswift-example&redirect-url=https%3A%2F%2Fapp.makeswift.com&integration-ids=oac_51ryd7Pob5ZsyTFzNzVvpsGq,oac_nsrwzogJLEFglVwt2060kB0y&external-id=dato-makeswift)

### Option 2: Local Development

1. Set up the project:

   ```bash
   npx makeswift@latest init --example=dato
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables in `.env.local`:

   ```
   NEXT_PUBLIC_DATO_CMS_API_TOKEN=your_token
   MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
   ```

4. Setting up DatoCMS
   To get started with blog posts, you'll need to set up a content model in DatoCMS. Here's what we recommend:

Create a new model called "Blog" with the following fields:

- **Title | Single-line String** - A text field for the post title
- **Slug | Single-line String** - A URL-friendly identifier (e.g. "my-first-blog-post")
- **Description | Multi-paragraph Text** - A detailed description of the blog post
- **Body | Structured Text** - The main content as structured text
  - Ensure to add "Image" in the "Specify the blocks allowed" validation field
- **Banner | Image** - An optional hero image for the post
- **Feed Date | Date** - The date when the post should appear in feeds
- **Author | Link to Author** - A reference to the post's author

## Author Model

- **Name | Single-line String** - The author's full name
- **Slug | Single-line String** - A URL-friendly identifier for the author
- **Description | Structured Text** - A detailed description of the author
- **Job Title | Single-line String** - The author's professional title

5. Generate DatoCMS types:

   ```bash
   pnpm codegen-ts
   ```

6. Run the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Building Blog Posts

1. Publish blog posts in DatoCMS with the same content model.
2. Access them at `/blog/[slug]` by clicking on the Makeswift URL bar, and type `/blog/your-blog-slug`.
3. Use the Makeswift builder to customize the blog template.

### Blog Components

The integration includes several pre-built components for working with DatoCMS content, organized in the following structure:

```
components/
└── Dato/
    ├── common/        # Common utility components
    ├── entries/       # Entry-specific components
    │   └── BlogPost/  # Blog post components
    └── queries/       # GraphQL queries
```

#### BlogPost Components

1. **BlogPostText**

   - Renders text fields from blog posts
   - Supports all text-based fields from your DatoCMS schema
   - Automatically updates when new text fields are added

2. **BlogPostRichText**

   - Renders structured text content from DatoCMS
   - Has controls to determine which RichText field to render
   - Automatically updates when new RichText fields are added to the schema
   - See `BlogPostRichText.makeswift.ts` for implementation details

3. **BlogPostImage**

   - Handles blog post images and media
   - Supports responsive image loading
   - Configurable image quality and dimensions

4. **BlogPostFeed**
   - Queries all blog posts from DatoCMS
   - Handles pagination
   - Can be embedded in any Makeswift page
   - Usually placed in the parent route `/blog`

To use these components in Makeswift:

1. Navigate to your blog post page in the builder's URL bar (e.g., `/blog/my-blog`)
2. In the Makeswift builder, drag the desired component onto your page
3. Use the component's combobox to select the corresponding GraphQL field you want to render
4. The component will fetch and display the content from DatoCMS

## Troubleshooting

Common issues and solutions:

1. **Type generation fails**

   - Ensure DatoCMS credentials are correct
   - Check if content model is published and matches what's being queried

2. **Blog posts not showing**

   - Verify the slug format matches the route pattern
   - Check if posts are published in DatoCMS

3. **Makeswift builder issues**
   - Clear browser cache
   - Ensure API keys are correctly set

## Next Steps

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [DatoCMS API Reference](https://www.datocms.com/docs/content-management-api)
- [GitHub Repository](https://github.com/makeswift/makeswift)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## License

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
