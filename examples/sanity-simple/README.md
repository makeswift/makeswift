# Makeswift + Sanity Integration

This integration demonstrates how to combine the power of Sanity's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in Sanity but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [Sanity](https://www.sanity.io/) account (for content management) [Sign up for free](https://www.sanity.io/get-started)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
sanity-simple/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog-related routes
│   │   ├── [slug]/               # Dynamic blog post pages
│   ├── api/makeswift/            # Makeswift API routes
│   ├── [[...path]]/              # Dynamic Makeswift routes
├── components/                   # Generic components
├── lib/                          # Utility functions and configs
│   ├── sanity/                   # Sanity utilities
│   └── makeswift/                # Makeswift configuration
├── generated/                    # Auto-generated TypeScript types
├── vibes/soul/                   # Pre-built UI components
└── env.ts                        # Environment variable validation
```

## Getting started

### 1. Set up Sanity Studio

First, you'll need to create a new Sanity Studio project. This will serve as your content management system, where you'll create and manage blog posts and authors.

#### Install Sanity Studio

Before you begin, make sure you have Node.js version 20.19 or higher installed.

Sanity Studio can be embedded as a route in your Next.js app or installed as a standalone web app. For this guide, we’ll use a standalone setup.

In the desired parent directory, run the following command to create your Sanity Studio project:

```bash
npm create sanity@latest
```

The CLI will guide you through creating or signing into your Sanity account and setting up a new project. When prompted to select a project template, choose "Clean project with no predefined schema". For any prompts with default values, we suggest accepting the defaults.

Once the setup is complete, navigate to your Studio project directory and start the development server with:

```bash
npm run dev
```

This will launch Sanity Studio at `http://localhost:3333`.

#### Set up your content model

To get started with blog posts, you'll need to define a content model in Sanity Studio. We'll create two document types: Author and Post. These will represent your blog authors and individual blog entries.

Create the following schema files inside your Sanity Studio project:

**Author Type** (`schemaTypes/authorType.ts`):

```typescript
import { defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'avatar',
      type: 'image',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
```

**Post Type** (`schemaTypes/postType.ts`):

```typescript
import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
  ],
})
```

After defining your document types, register them in `schemaTypes/index.ts`:

```typescript
import { authorType } from './authorType'
import { postType } from './postType'

export const schemaTypes = [authorType, postType]
```

Finally, deploy a GraphQL API to enable querying your content. The Sanity CLI will automatically generate the schema from your document types and handle the deployment.

From your Sanity Studio directory, run:

```bash
npx sanity graphql deploy
```

This command will:

- Generate a GraphQL schema based on your document types
- Deploy the API to Sanity's infrastructure
- Make it available at your GraphQL endpoint

#### Add content for testing

In your local Sanity Studio app (`http://localhost:3333`), create and publish a few sample blog posts, linking each to an author. Ensure that all posts include a published date and are marked as published.

Note your project ID and generate an API token in your project dashboard at [sanity.io](https://www.sanity.io/manage).

### 2. Clone our example with the Makeswift CLI

```bash
npx makeswift@latest init --example=sanity-simple
```

### 3. Configure environment variables

Here is how your `.env.local` should look once setup is finished:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_ACCESS_TOKEN=your_sanity_access_token
```

**MAKESWIFT_SITE_API_KEY**: Automatically applied, found in your Makeswift site settings

You will be prompted for:

**SANITY_PROJECT_ID**: Your Sanity project ID
**SANITY_ACCESS_TOKEN**: Generate an API token in your Sanity project dashboard at [sanity.io](https://www.sanity.io/manage)

The CLI should start up your development environment automatically, but if you need to run the server manually, use:

```bash
npm run dev
```

Once your development server is running, go back to your Makeswift site settings and set the **Host URL** to the URL your dev host is running on (ex:`http://localhost:3000`).

If you modify the GraphQL queries in the future, run the following command to regenerate types:

```bash
npm run codegen-ts-watch
```

This will regenerate the GraphQL types and watch for changes.

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from Sanity based on their slug. You don't need to manually add or publish each blog post in Makeswift—once a post is published in Sanity, it will automatically appear on your site.

By default, the blog post layout includes the essential elements you'd expect: title, date, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your any of your blog post pages by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
2. In the builder's navigation sidebar, switch to the Elements tab and click on the _Blog footer_ element to select it.
3. In the Properties sidebar, uncheck the _Use fallback_ checkbox to display the _Blog footer_ slot on the page.
4. You can now drag and drop any components into the slot. For example, to display a list of recent posts on each blog page, you can add the Blog Feed component included with this integration. Once you publish your changes, they'll appear on every page under `/blog/[slug]`.

You can also use the same Blog Feed component to build your blog index page (`/blog/`). Simply create a new page with that path in the builder, then add the Blog Feed component along with any other content you'd like to include. To control how many posts are displayed, adjust the component's _Items per page_ property in the Properties sidebar.

## Development Guide

### GraphQL Code Generation

Types are automatically generated from your Sanity schema. The configuration is in `graphql.config.ts` and types are output to `generated/sanity.ts`.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [`vibes/README.md`](vibes/README.md) for more details.

- **BlogPostList** – Displays a grid of blog post cards.
- **BlogPostContent** – Renders individual blog post content with breadcrumbs.
- **SectionLayout** – Provides consistent spacing and layout structure.

### Content Formatting

Blog posts are transformed from Sanity's structure to match the API expected by the VIBES components using utility functions in [`lib/sanity/format.ts`](lib/sanity/format.ts). The post body is rendered using the [`@portabletext/react`](https://www.npmjs.com/package/@portabletext/react) package.

## Troubleshooting

Common issues and solutions:

- **Type generation fails**
  - Ensure your Sanity credentials are correct in `.env.local`.
  - Verify your Sanity GraphQL endpoint is accessible.
  - Verify that the relevant content is published in Sanity.

- **Pages not displaying content**
  - Check if blog posts exist in Sanity.
  - Confirm that the slug format matches your entries in Sanity.
  - Ensure posts have `publishedAt` dates and are not drafts.
  - Verify that your host URL is set to the same URL as your dev server (ex: `http://localhost:3000`) in your Makeswift site settings.

- **Images not loading**
  - Verify image fields are properly configured in your Sanity schema.

## Learn More

To learn more about the technologies used in this integration:

- [Makeswift Documentation](https://docs.makeswift.com/)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Sanity GraphQL API Reference](https://www.sanity.io/docs/graphql)
