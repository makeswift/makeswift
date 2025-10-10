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

### 1. Set up Strapi locally

Before integrating with Makeswift, you'll need to create a new Strapi project. This will serve as your content management system, where you'll create and manage blog posts and authors.

#### Install Strapi Server

Before you begin, make sure you have Node.js version 20.19 or higher installed.

For this guide, we'll use the Strapi server as a standalone setup.

In the desired parent directory, run the following command to create your Strapi project:

```bash
npx create-strapi-app@latest my-strapi-project
```

You can read the full guide on Strapi [here](https://docs.strapi.io/cms/quick-start)

#### Install the GraphQL plugin

Strapi's GraphQL plugin is required for this integration. Before starting the Strapi server, install the plugin:

```bash
cd my-strapi-project
npm install @strapi/plugin-graphql
```

#### Start the Strapi development server

Now start the Strapi development server:

```bash
npm run develop
```

This will:

- Start Strapi on `http://localhost:1337`
- Open the admin panel in your browser

Once logged in, you can verify the GraphQL plugin is enabled by visiting `http://localhost:1337/graphql`.

#### Get your Strapi API token

1. In the Strapi admin panel in `http://localhost:1337/admin`, go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Name it (e.g., "Next.js Integration")
4. Set **Token type** to "Read-only"
5. Set **Token duration** to "Unlimited"
6. Click **Save** and copy the generated token (you'll need this in the next step)

### 2. Clone the example with the Makeswift CLI

Run the following command to create your Makeswift project:

```bash
npx makeswift@latest init --example=strapi-simple
```

### 3. Configure environment variables (initial setup)

Here is how your `.env.local` should look once setup is finished:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
STRAPI_ACCESS_TOKEN=your_strapi_access_token
NEXT_PUBLIC_STRAPI_SERVER_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=https://example.com
```

**MAKESWIFT_SITE_API_KEY**: Automatically applied, found in your Makeswift site settings

You will be prompted for:

- **STRAPI_ACCESS_TOKEN**: The API token you created in Step 1. If you need to retrieve it again, go to **Settings** → **API Tokens** in your Strapi admin panel
- **NEXT_PUBLIC_STRAPI_SERVER_URL**: Use `http://localhost:1337` for local development, or your deployed Strapi URL for production
- **NEXT_PUBLIC_SITE_URL**: Use a placeholder like `https://example.com` for now. Update this with your deployed domain after deployment. This is used for generating the sitemap

The CLI should start up your development environment automatically, but if you need to run the server manually use:

```bash
npm run dev
```

## Setting Up Content Types

Now that Strapi is running, you'll need to create the content types for your blog. We'll create two content types: **Author** and **Blog Post**.

### Create the Author Content Type

First, we'll create the Author content type since Blog Posts will reference it.

1. In the Strapi admin panel, go to **Content-Type Builder**
2. Click **Create new collection type**
3. Enter the display name: `Author`
4. Click **Continue**
5. Add the following field:
   - **name**: Text (Short text, set as required in the Advanced Settings tab)
6. Click **Finish**, then **Save** in the top right corner
7. Wait for Strapi to restart (this happens automatically)

#### Create an Author Entry

1. Go to **Content Manager** in the sidebar
2. Select **Author** under Collection Types
3. Click **Create new entry** in the top right
4. Fill in the **name** field (e.g., "John Doe")
5. Click **Publish** in the top right

### Create the Blog Post Content Type

Now we'll create the Blog Post content type with all the necessary fields.

1. In the Strapi admin panel, go to **Content-Type Builder**
2. Click **Create new collection type**
3. Enter the display name: `Blog Post`
4. Click **Continue**
5. Add the following fields one by one (click **Add another field** between each):
   - **title**: Text (Short text)
   - **description**: Text (Long text)
   - **slug**: Text (Short text, set as required in the Advanced Settings tab)
   - **feedDate**: Date
   - **body**: Rich text (Blocks)
   - **cover**: Media (Single media)
   - **author**: Relation (Author has many Blog Posts)
6. Click **Finish**, then **Save** in the top left corner
7. Wait for Strapi to restart

#### Create a Blog Post Entry

1. Go to **Content Manager** in the sidebar
2. Select **Blog Post** under Collection Types
3. Click **Create new entry** in the top right
4. Fill in all the fields:
   - **title**: Enter a blog post title (e.g., "Welcome to Our Blog")
   - **description**: Enter a short description
   - **slug**: Enter a URL-friendly slug (e.g., "welcome-to-our-blog")
   - **feedDate**: Select a date
   - **body**: Add rich text content
   - **cover**: Upload an image for the blog post
   - **author**: Select the author you created earlier
5. Click **Publish** in the top right

### Configure Public Access Permissions

By default, Strapi content is private. You need to enable public read access for the new types you just created:

1. In the Strapi admin panel, go to **Settings** → **Users & Permissions plugin** → **Roles**
2. Click on **Public**
3. Scroll down to **Permissions**
4. Under **Blog-post**, check the boxes for:
   - **find**
   - **findOne**
5. Under **Author**, check the boxes for:
   - **find**
   - **findOne**
6. Click **Save** in the top right corner

Your content is now accessible via the GraphQL API!

If you modify the GraphQL queries in the future, run the following command to regenerate types and watch for future changes:

```bash
npm run codegen-ts-watch
```

This will regenerate the GraphQL types and watch for changes.

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from Strapi based on their slug. You don’t need to manually add or publish each blog post in Makeswift—once a post is published in Strapi, it will automatically appear on your site.

By default, the blog post layout includes the essential elements you'd expect: title, date, author, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to any of your blog post pages by entering the post's full URL (e.g., `/blog/welcome`) in the builder's URL bar.
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
  - Verify that the GraphQL plugin is installed and enabled in Strapi.
  - Ensure that the relevant content is published in Strapi.
  - Try accessing `http://localhost:1337/graphql` to confirm the GraphQL playground is available.

- **Blog posts not showing**

  - Confirm that the slug format matches your entries in Strapi.
  - Make sure the posts are published in Strapi.
  - Verify that public permissions are enabled for **Blog-post** (see "Configure Public Access Permissions").

- **Makeswift builder issues**

  - Clear your browser cache and refresh the page.
  - Make sure the `MAKESWIFT_SITE_API_KEY` is correctly set.
  - Verify that your host URL is set to http://localhost:3000/ in your Makeswift site settings.

- **GraphQL errors**
  - Run `npm run codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced content types (**Author** and **Blog Post**) exist and are published.
  - Verify that public permissions are enabled for both content types.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Strapi GraphQL Documentation](https://docs.strapi.io/developer-docs/latest/plugins/graphql.html)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
