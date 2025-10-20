# Makeswift + DatoCMS Integration

This integration demonstrates how to combine the power of DatoCMS's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in DatoCMS but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [DatoCMS](https://www.datocms.com/) account (for content management) [Sign up for free](https://dashboard.datocms.com/signup)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
dato-simple/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog-related routes
│   │   ├── [slug]/               # Dynamic blog post pages
│   ├── api/makeswift/            # Makeswift API routes
│   ├── api/dato/                 # DatoCMS API routes
│   ├── [[...path]]/              # Dynamic Makeswift routes
├── components/                   # Generic components
├── lib/                          # Utility functions and configs
│   ├── dato/                     # DatoCMS utilities
│   └── makeswift/                # Makeswift configuration
├── generated/                    # Auto-generated TypeScript types
├── vibes/soul/                   # Pre-built UI components
└── env.ts                        # Environment variable validation
```

## Quick Start

### 1. Clone the repository

```bash
   npx makeswift@latest init --example=dato-simple
```

### 2. Configure environment variables

Create a `.env.local` file and add your credentials. Ensure that your DatoCMS token has permission to access the Content Delivery API.

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
DATO_CMS_API_TOKEN=your_dato_api_token
```

### 3. Set up your content model in DatoCMS

To get started with blog posts, you'll need to set up a content schema in DatoCMS. Here's how we did it:

**Create a new model called "Author" with the following fields:**

- **Name** (Single-line string) – The name of the author. Mark this field as unique and required.
- **Slug** (SEO > Slug) – A URL-friendly identifier. Set **Name** as the reference field, and mark it unique and required.
- **Job Title** (Single-line string) – The author's job title.
- **Description** (Structured text) – A short bio of the author.
- **Avatar** (Media > Single Asset) – The author’s profile image.

**Create a new model called "BlogPost" with the following fields:**

- **Title** (Single-line text) – A short text field for the post title. Mark this field as unique and required.
- **Description** (Multi-paragraph text) – A brief summary of the post.
- **Slug** (SEO > Slug) – A URL-friendly identifier. Set **Title** as the reference field, and mark it unique and required.
- **Feed Date** (Date) – The date the post should appear in the feed. Mark this field as required.
- **Body** (Structured text) – The main content as structured text.
- **Author** (Single link) – The author of the blog post. In the _Validations_ tab, select "Author" in the “Accept only specified model” input.
- **Banner** (Media > Single Asset) – An optional hero image for the post

Be sure to add a few blog posts for testing purposes, and connect them to an author.

### 4. Generate TypeScript types

```bash
npm run codegen-ts
```

This command watches for changes and regenerates types automatically.

### 5. Run the development server

```bash
npm run dev
```

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from DatoCMS based on their slug. You don't need to manually add or publish each blog post in Makeswift—once a post is published in DatoCMS, it will automatically appear on your site.

By default, the blog post layout includes the essential elements you'd expect: title, date, author, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your any of your blog post pages by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
2. In the builder's navigation sidebar, switch to the Elements tab and click on the _Blog footer_ element to select it.
3. In the Properties sidebar, uncheck the _Use fallback_ checkbox to display the _Blog footer_ slot on the page.
4. You can now drag and drop any components into the slot. For example, to display a list of recent posts on each blog page, you can add the Blog Feed component included with this integration. Once you publish your changes, they'll appear on every page under `/blog/[slug]`.

You can also use the same Blog Feed component to build your blog index page (`/blog/`). Simply create a new page with that path in the builder, then add the Blog Feed component along with any other content you'd like to include. To control how many posts are displayed, adjust the component's _Items per page_ property in the Properties sidebar.

## Development Guide

### GraphQL Code Generation

Types are automatically generated from your DatoCMS schema. The configuration is in `graphql.config.ts` and types are output to `generated/dato.ts`.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [`vibes/README.md`](vibes/README.md) for more details.

- **BlogPostList** – Displays a grid of blog post cards.
- **BlogPostContent** – Renders individual blog post content with breadcrumbs.
- **SectionLayout** – Provides consistent spacing and layout structure.

### Content Formatting

Blog posts are transformed from DatoCMS's structure to match the API expected by the VIBES components using utility functions in [`lib/dato/format.ts`](lib/dato/format.ts).

## Troubleshooting

Common issues and solutions:

- **Type generation fails**
  - Ensure your DatoCMS credentials are correct in `.env.local`.
  - Check that your content model matches the GraphQL query.
  - Verify that the relevant content is published in DatoCMS.

- **Blog posts not showing**
  - Confirm that the slug format matches your entries in DatoCMS.
  - Make sure the posts are published.
  - Ensure required fields—**Title**, **Slug**, **Feed Date**, **Body**, and **Banner**—are populated.

- **Makeswift builder issues**
  - Clear your browser cache and refresh the page.
  - Make sure the `MAKESWIFT_SITE_API_KEY` is correctly set.
  - Verify that your host URL is set to http://localhost:3000/ in your Makeswift site settings.

- **GraphQL errors**
  - Run `npm codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced content types (e.g., **Author**, **Blogpost**) exist and are published.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [DatoCMS GraphQL API Reference](https://www.datocms.com/docs/content-delivery-api/graphql)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
