# Makeswift + Contentful Integration

This integration allows you to combine the power of Contentful's content management with Makeswift's visual page building capabilities. Visually create dynamic, content-rich websites with a seamless development experience.

For a detailed guide on setting up and using this integration, visit:
https://www.makeswift.com/integrations/contentful

## Prerequisites

- [Node.js](https://nodejs.org/) 18.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building)
- [Contentful](https://www.contentful.com/) account (for content management)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
contentful/
├── app/                   # Next.js App Router pages
│   ├── blog/              # Blog-related routes
│   ├── api/               # API endpoints
│   └── [[...path]]/       # Dynamic Makeswift routes
├── components/            # Reusable React components
│   └── contentful/        # Contentful-specific components
│       ├── common/        # Common scalar components
│       ├── entries/       # Entry-specific components
│       │   └── BlogPost/  # BlogPost entry components
│       └── queries/       # GraphQL queries
├── lib/                   # Utility functions and configs
└── generated/             # Auto-generated types from Contentful
```

## Quick Start

### 1. Set up the project

   ```bash
   npx makeswift@latest init --example=contentful
   ```

### 2. Configure environment variables in `.env.local`

   ```
   MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   ```

### 3. Set up your content model

To get started with blog posts, you'll need to set up a content model in Contentful. Here's what we recommend:

- Create a new content type called "Author" with the following fields:

   - **Name** (Short text) - The name of the author. Make sure to check "This field represents the Entry title" in the field options.
   - **Slug** (Short text) - A URL-friendly identifier (e.g. "author-name")
   - **Job Title** (Short text) - The author's job title
   - **Description** (Rich text) - The main content as rich text
   - **Avatar** (Media) - An optional avatar image representing the author

- Create a new content type called "BlogPost" with the following fields:

   - **Title** (Short text) - A short text field for the post title. Make sure to check "This field represents the Entry title" in the field options.
   - **Description** (Long text) - A brief summary of the content
   - **Slug** (Short text) - A URL-friendly identifier (e.g. "my-first-blog-post")
   - **Feed Date** (Date & time) - When the post should appear in feed
   - **Body** (Rich text) - The main content as rich text
   - **Author** (Reference) - Which Author created the blog. Ensure that "Accept only specified entry type" is enabled in order to introspect this reference.
   - **Banner** (Media) - An optional hero image for the post
   
Be sure to add a few blog posts for testing purposes, and connect them to an Author.

### 4. Generate Contentful types

   ```bash
   pnpm codegen-ts
   ```

Note that the only query we are working with is in `/components/Contentful/GetBlogs.graphql`.

### 5. Run the development server
   ```bash
   pnpm dev
   ```

## Building Blog Post pages in Makeswift

1. Publish your content in Contentful.
2. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your blog post page by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
3. The first time you visit the page, you’ll see a blank canvas with a placeholder for content. Drag the desired blog component onto the page.
4. Use the component’s **Field** dropdown to select the content field you want to render (e.g., **Description**).
5. The component will fetch and display the selected content from Contentful.

For example, to display a blog post’s title:

1. Drag the **Blog Text** component from the [component toolbar](https://docs.makeswift.com/product/builder-basics#component-toolbar) onto your blog post page.
2. In the [properties sidebar](https://docs.makeswift.com/product/builder-basics#properties-sidebar), find the **Field** dropdown and select the appropriate content field—in our case, **Title**.
3. The component will render the blog post's title.

## Development Guide

### Contentful Components

The integration includes several pre-built components for working with Contentful content. These components are located in the [`components/contentful/`](components/contentful/) directory and are organized into two main categories:

#### Common Components ([`components/contentful/common/`](components/contentful/common/))

These are utility components that provide shared functionality for working with Contentful content.

#### Entry Components ([`components/contentful/entries/`](components/contentful/entries))

These components are designed to work with specific Contentful content types:

- [`BlogPostFeed`](components/contentful/entries/BlogPost/BlogPostFeed): Shows a list of blog posts
- [`BlogPostText`](components/contentful/entries/BlogPost/BlogPostText): Renders short text fields belonging to blog posts
- [`BlogPostRichText`](components/contentful/entries/BlogPost/BlogPostRichText): Displays rich text content
- [`BlogPostImage`](components/contentful/entries/BlogPost/BlogPostImage): Handles blog post images

## Troubleshooting

Common issues and solutions:

- **Type generation fails**

   - Ensure Contentful credentials are correct
   - Check if content model is published and matches what's being queried

- **Blog posts not showing**

   - Verify the slug format matches the route pattern
   - Check if posts are published in Contentful

- **Makeswift builder issues**
   - Clear browser cache
   - Ensure API keys are correctly set

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Contentful API Reference](https://www.contentful.com/developers/docs/references/)
