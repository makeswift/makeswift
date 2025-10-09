# Makeswift + DatoCMS Integration

This integration allows you to combine the power of DatoCMS's content management with Makeswift's visual page building capabilities. Visually create dynamic, content-rich websites with a seamless development experience.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building)
- [DatoCMS](https://www.datocms.com/) account (for content management)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
dato/
├── app/                   # Next.js App Router pages
│   ├── blog/              # Blog-related routes
│   ├── api/               # API endpoints
│   └── [[...path]]/       # Dynamic Makeswift routes
├── components/            # Reusable React components
│   └── dato/              # DatoCMS-specific components
│       ├── common/        # Common scalar components
│       ├── entries/       # Entry-specific components
│       │   └── BlogPost/  # BlogPost entry components
│       └── queries/       # GraphQL queries
├── lib/                   # Utility functions and configs
└── generated/             # Auto-generated types from DatoCMS
```

## Quick Start

### 1. Set up the project

```bash
npx makeswift@latest init --example=dato
```

The CLI will prompt you for the following environment variables:

- **MAKESWIFT_SITE_API_KEY**: Find this in your [Makeswift dashboard](https://app.makeswift.com/) under Settings > Host > API Key
- **DATO_CMS_API_TOKEN**: Generate this in your [DatoCMS project](https://www.datocms.com/) under Settings > API Tokens. Create or use a "Read-only" token with access to the Content Delivery API.
- **NEXT_PUBLIC_SITE_URL**: This is the URL you want to prefix your sitemap links with.

### 2. Set up your content model

To get started with blog posts, you'll need to set up a content model in DatoCMS. Here's what we recommend:

- Create a new model called "Author" with the following fields:

  - **Name** (Single-line string) - The name of the author. Make sure to check "This field represents the Entry title" in the field options.
  - **Slug** (SEO > Slug) - A URL-friendly identifier (e.g. "author-name")
  - **Job Title** (Single-line string) - The author's job title
  - **Description** (Structured text) - The main content as structured text
  - **Avatar** (Media > Single Asset) - An optional avatar image representing the author

- Create a new model called "BlogPost" with the following fields:

  - **Title** (Single-line text) - A short text field for the post title. Make sure to check "This field represents the Entry title" in the field options.
  - **Description** (Multi-paragraph text) - A brief summary of the content
  - **Slug** (SEO > Slug) - A URL-friendly identifier (e.g. "my-first-blog-post")
  - **Feed Date** (Date) - When the post should appear in feed
  - **Body** (Structured text) - The main content as structured text
  - **Author** (Single link) - Which Author created the blog. Ensure that "Accept only specified model" is enabled in order to introspect this reference.
  - **Banner** (Media > Single Asset) - An optional hero image for the post

Be sure to add a few blog posts for testing purposes, and connect them to an Author.

### 3. Generate DatoCMS types

```bash
pnpm codegen-ts
```

Note that the queries we are working with are in `/components/dato/queries/GetBlogs.graphql`.

### 4. Run the development server

```bash
pnpm dev
```

## Building Blog Post pages in Makeswift

1. Publish your content in DatoCMS.
2. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your blog post page by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
3. The first time you visit the page, you'll see a blank canvas with a placeholder for content. Drag the desired blog component onto the page.
4. Use the component's **Field** dropdown to select the content field you want to render (e.g., **Description**).
5. The component will fetch and display the selected content from DatoCMS.

For example, to display a blog post's title:

1. Drag the **Blog Text** component from the [component toolbar](https://docs.makeswift.com/product/builder-basics#component-toolbar) onto your blog post page.
2. In the [properties sidebar](https://docs.makeswift.com/product/builder-basics#properties-sidebar), find the **Field** dropdown and select the appropriate content field—in our case, **Title**.
3. The component will render the blog post's title.

## Development Guide

### DatoCMS Components

The integration includes several pre-built components for working with DatoCMS content. These components are located in the [`components/dato/`](components/dato/) directory and are organized into two main categories:

#### Common Components ([`components/dato/common/`](components/dato/common/))

These are utility components that provide shared functionality for working with DatoCMS content:

- [`DatoText`](components/dato/common/DatoText): Renders text fields (strings)
- [`DatoImage`](components/dato/common/DatoImage): Handles image assets
- [`DatoRichText`](components/dato/common/DatoRichText): Displays structured text content

#### Entry Components ([`components/dato/entries/`](components/dato/entries))

These components are designed to work with specific DatoCMS content types:

- [`BlogPostFeed`](components/dato/entries/BlogPost/BlogPostFeed): Shows a list of blog posts
- [`BlogPostText`](components/dato/entries/BlogPost/BlogPostText): Renders short text fields belonging to blog posts
- [`BlogPostRichText`](components/dato/entries/BlogPost/BlogPostRichText): Displays structured text content
- [`BlogPostImage`](components/dato/entries/BlogPost/BlogPostImage): Handles blog post images

### How It Works

The integration uses a pattern where:

1. **Common components** (like `DatoText`) are generic and work with any field data
2. **Entry-specific components** (like `BlogPostText`) wrap common components and:
   - Use the `useEntryField` hook to fetch field data from the current entry
   - Pass that data to the common component for rendering

This pattern allows you to:

- Build reusable common components once
- Quickly create entry-specific components for any content type
- Provide a great visual editing experience with field dropdowns

## Troubleshooting

Common issues and solutions:

- **Type generation fails**

  - Ensure DatoCMS credentials are correct
  - Check if content model is published and matches what's being queried

- **Blog posts not showing**

  - Verify the slug format matches the route pattern
  - Check if posts are published in DatoCMS

- **Makeswift builder issues**
  - Clear browser cache
  - Ensure API keys are correctly set

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [DatoCMS GraphQL API Reference](https://www.datocms.com/docs/content-delivery-api/graphql)
