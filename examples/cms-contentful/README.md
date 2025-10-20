# Makeswift + Contentful Integration

This integration demonstrates how to combine the power of Contentful's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in Contentful but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [Contentful](https://www.contentful.com/) account (for content management) [Sign up for free](https://www.contentful.com/sign-up)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
contentful-simple/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog-related routes
│   │   ├── [slug]/               # Dynamic blog post pages
│   ├── api/makeswift/            # Makeswift API routes
│   ├── [[...path]]/              # Dynamic Makeswift routes
├── components/                   # Generic components
├── lib/                          # Utility functions and configs
│   ├── contentful/               # Contentful utilities
│   └── makeswift/                # Makeswift configuration
├── generated/                    # Auto-generated TypeScript types
├── vibes/soul/                   # Pre-built UI components
└── env.ts                        # Environment variable validation
```

## Quick Start

### 1. Clone the repository

```bash
   npx makeswift@latest init --example=contentful-simple
```

### 2. Configure environment variables

Create a `.env.local` file and add your credentials:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
NEXT_PUBLIC_SITE_URL=your_site_url
```

### 3. Set up your content model in Contentful

To get started with blog posts, you'll need to set up a content model in Contentful. Here's what how we did it:

**Create a new content type called "Author" with the following fields:**

- **Name** (Short text) - The author's name (mark as "Entry title")
- **Slug** (Short text) - URL-friendly identifier (this is required)
- **Job Title** (Short text) - The author's job title
- **Description** (Rich text) - Author bio
- **Avatar** (Media) - Profile image

**Create a new content type called "BlogPost" with the following fields:**

- **Title** (Short text) - Post title (mark as "Entry title")
- **Description** (Long text) - Brief summary
- **Slug** (Short text) - URL-friendly identifier
- **Feed Date** (Date & time) - Publication date
- **Body** (Rich text) - Main content
- **Author** (Reference) - Reference to Author content type
- **Banner** (Media) - Hero image

Be sure to add a few blog posts for testing purposes, and connect them to an author.

### 4. Generate TypeScript types

```bash
npm run codegen-ts
```

This command watches for changes and regenerates types automatically.

### 6. Run the development server

```bash
npm dev
```

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from Contentful based on their slug. You don’t need to manually add or publish each blog post in Makeswift—once a post is published in Contentful, it will automatically appear on your site.

By default, the blog post layout includes the essential elements you'd expect: title, date, author, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your any of your blog post pages by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
2. In the builder's navigation sidebar, switch to the Elements tab and click on the _Blog footer_ element to select it.
3. In the Properties sidebar, uncheck the _Use fallback_ checkbox to display the _Blog footer_ slot on the page.
4. You can now drag and drop any components into the slot. For example, to display a list of recent posts on each blog page, you can add the Blog Feed component included with this integration. Once you publish your changes, they’ll appear on every page under `/blog/[slug]`.

You can also use the same Blog Feed component to build your blog index page (`/blog/`). Simply create a new page with that path in the builder, then add the Blog Feed component along with any other content you’d like to include. To control how many posts are displayed, adjust the component’s _Items per page_ property in the Properties sidebar.

## Development Guide

### GraphQL Code Generation

Types are automatically generated from your Contentful schema. The configuration is in `graphql.config.ts` and types are output to `generated/contentful.ts`.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [`vibes/README.md`](vibes/README.md) for more details.

- **BlogPostList** – Displays a grid of blog post cards.
- **BlogPostContent** – Renders individual blog post content with breadcrumbs.
- **SectionLayout** – Provides consistent spacing and layout structure.

### Content Formatting

Blog posts are transformed from Contentful’s structure to match the API expected by the VIBES components using utility functions in [`lib/contentful/format.ts`](lib/contentful/format.ts).

## Troubleshooting

Common issues and solutions:

- **Type generation fails**

  - Ensure your Contentful credentials are correct in `.env.local`.
  - Check that your content model matches the GraphQL query.
  - Verify that the relevant content is published in Contentful.

- **Blog posts not showing**

  - Confirm that the slug format matches your entries in Contentful.
  - Make sure the posts are published.
  - Ensure required fields—**Title**, **Slug**, **Feed Date**, **Body**, and **Banner**—are populated.

- **Makeswift builder issues**

  - Clear your browser cache and refresh the page.
  - Make sure the `MAKESWIFT_SITE_API_KEY` is correctly set.
  - Verify that your host URL is set to http://localhost:3000/ in your Makeswift site settings.

- **GraphQL errors**
  - Run `npm codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced content types (e.g., **Author**, **BlogPost**) exist and are published.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Contentful GraphQL API Reference](https://www.contentful.com/developers/docs/references/graphql/)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
