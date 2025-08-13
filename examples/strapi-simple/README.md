# Makeswift + Strapi Integration

This integration demonstrates how to combine the power of Strapi's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in Strapi but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [Strapi](https://strapi.io/) instance running (for content management) [Get started with Strapi](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
strapi-simple/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog-related routes
│   │   ├── [slug]/               # Dynamic blog post pages
│   ├── api/makeswift/            # Makeswift API routes
│   ├── api/strapi/               # Strapi API routes
│   ├── [[...path]]/              # Dynamic Makeswift routes
├── components/                   # Generic components
├── lib/                          # Utility functions and configs
│   ├── strapi/                   # Strapi utilities
│   └── makeswift/                # Makeswift configuration
├── generated/                    # Auto-generated TypeScript types
├── vibes/soul/                   # Pre-built UI components
└── env.ts                        # Environment variable validation
```

## Quick Start

### 1. Clone the repository

```bash
   npx makeswift@latest init --example=strapi-simple
```

### 2. Set up Strapi locally

Before jumping into Strapi with Makeswift, you'll need to create a new Strapi project. This will serve as your content management system, where you'll create and manage blog posts and authors.

#### Install Strapi Server

Before you begin, make sure you have Node.js version 20.19 or higher installed.

For this guide, we’ll use the Strapi server as a standalone setup.

In the desired parent directory, run the following command to create your Strapi project:

```bash
npx create-strapi-app@latest my-strapi-project
```

You can read the full guide on Strapi [here](https://docs.strapi.io/cms/quick-start)

Navigate to the Strapi project directory and start the Strapi development server:

```bash
npm run develop
```

This will:

- Start Strapi on `http://localhost:1337`
- Open the admin panel in your browser

### 3. Get your Strapi API token

1. In the Strapi admin panel, go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Name it (e.g., "Next.js Integration")
4. Set **Token type** to "Read-only"
5. Set **Token duration** to "Unlimited"
6. Click **Save** and copy the generated token

### 4. Configure environment variables

Navigate back to the Makeswift project and create a `.env.local` file:

Add your credentials to `.env.local`:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
STRAPI_ACCESS_TOKEN=your_strapi_api_token_from_step_3
NEXT_PUBLIC_STRAPI_SERVER_URL=http://localhost:1337
```

### 5. Generate TypeScript types

Install dependencies and generate TypeScript types from your Strapi GraphQL schema:

```bash
npm install
npm run codegen-ts
```

This command watches for changes and regenerates types automatically.

### 6. Run the development server

```bash
npm run dev
```

Your site will be available at `http://localhost:3000`. Ensure the strapi server continues running.

## Content Model

The Strapi project comes pre-configured with all the necessary content types for a blog:

#### Adding the `body` field

Let's add a field called **body** to your Article content type so we can use rich text:

1. In the Strapi admin panel, go to **Content-Type Builder**
2. Select the **Article** content type
3. Click **Add another field in this collection type**
4. Set the field name to `body`
5. Choose **Rich Text (Blocks)** as the field type
6. Configure the field settings:
   - Set as **Required** if desired
   - Enable **Blocks** for rich content formatting
     Do not click "Finish", we will add another field.

#### Adding the `feedDate` field

1. Click "Add another field"
2. Set the field name to `feedDate`
3. Choose **date (ex: 01/01/2025)** as the field type
4. Click "Finish"

Publish the changes by clicking "Save" on the top right.

## Adding Entries

1. Navigate to the **Content Manager**
2. Select the **Article** collection type
3. Click "Create new entry" on the top right
4. Publish the blog with all the inserted information

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from Strapi based on their slug. You don’t need to manually add or publish each blog post in Makeswift—once a post is published in Strapi, it will automatically appear on your site.

By default, the blog post layout includes the essential elements you'd expect: title, date, author, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your any of your blog post pages by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
2. In the builder's navigation sidebar, switch to the Elements tab and click on the _Blog footer_ element to select it.
3. In the Properties sidebar, uncheck the _Use fallback_ checkbox to display the _Blog footer_ slot on the page.
4. You can now drag and drop any components into the slot. For example, to display a list of recent posts on each blog page, you can add the Blog Feed component included with this integration. Once you publish your changes, they’ll appear on every page under `/blog/[slug]`.

You can also use the same Blog Feed component to build your blog index page (`/blog/`). Simply create a new page with that path in the builder, then add the Blog Feed component along with any other content you’d like to include. To control how many posts are displayed, adjust the component’s _Items per page_ property in the Properties sidebar.

## Development Guide

### GraphQL Code Generation

Types are automatically generated from your Strapi GraphQL schema. The configuration is in `graphql.config.ts` and types are output to `generated/strapi.ts`.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [`vibes/README.md`](vibes/README.md) for more details.

- **BlogPostList** – Displays a grid of blog post cards.
- **BlogPostContent** – Renders individual blog post content with breadcrumbs.
- **SectionLayout** – Provides consistent spacing and layout structure.

### Content Formatting

Blog posts are transformed from Strapi's structure to match the API expected by the VIBES components using utility functions in [`lib/strapi/format.ts`](lib/strapi/format.ts).

## Troubleshooting

Common issues and solutions:

- **Type generation fails**
  - Ensure your Strapi instance is running on localhost:1337.
  - Check that your Strapi access token is correct in `.env.local`.
  - Verify that the GraphQL plugin is enabled in Strapi.
  - Ensure that the relevant content is published in Strapi.

- **Blog posts not showing**
  - Confirm that the slug format matches your entries in Strapi.
  - Make sure the posts are published.
  - Ensure required fields—**slug**, **cover**, and **blocks**—are populated.

- **Makeswift builder issues**
  - Clear your browser cache and refresh the page.
  - Make sure the `MAKESWIFT_SITE_API_KEY` is correctly set.
  - Verify that your host URL is set to http://localhost:3000/ in your Makeswift site settings.

- **GraphQL errors**
  - Run `npm codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced content types (e.g., **Author**, **Article**) exist and are published.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Strapi GraphQL Documentation](https://docs.strapi.io/developer-docs/latest/plugins/graphql.html)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
