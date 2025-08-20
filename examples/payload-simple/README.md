# Makeswift + Payload Integration

This integration demonstrates how to combine the power of Payload's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in a separate Payload CMS instance but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- A compatible database such as [MongoDB](https://www.mongodb.com/) (for content storage)
- Separate [Payload CMS](https://payloadcms.com/) installation (see setup instructions below)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app) and [Payload CMS](https://payloadcms.com/)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
payload-simple/                     # Makeswift frontend application
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog-related routes
│   │   ├── [slug]/               # Dynamic blog post pages
│   ├── api/makeswift/            # Makeswift API routes
│   ├── [[...path]]/              # Dynamic Makeswift routes
├── components/                   # Generic components
├── lib/                          # Utility functions and configs
│   ├── payload/                  # Payload utilities (fetchers, GraphQL)
│   └── makeswift/                # Makeswift configuration
├── generated/                    # Auto-generated TypeScript types
├── vibes/soul/                   # Pre-built UI components
└── env.ts                        # Environment variable validation

my-payload-cms/                   # Separate Payload CMS installation
├── src/                          # Payload source code
│   ├── collections/              # Payload collections (Posts, Users, Media)
│   ├── app/                      # Payload admin and API routes
│   └── payload.config.ts         # Payload configuration
├── package.json                  # Payload dependencies
└── docker-compose.yml            # Docker setup for MongoDB
```

## Quick Start

### 1. Clone the repository

```bash
   npx makeswift@latest init --example=payload-simple
```

### 2. Set up Payload CMS separately

You'll need to create a separate Payload CMS installation that will serve as your content management system. This refers to the official Payload [installation guide](https://payloadcms.com/docs/getting-started/installation)

#### Quick Payload setup

Create a new Payload project in a separate directory:

**Step 1: Navigate to your projects directory**

```bash
# Navigate to your projects directory (outside of payload-simple)
cd ..
```

**Step 2: Create new Payload project**

💡 **Tip:** Have your database connection string ready to paste when prompted.

```bash
# Create new Payload project (this will prompt for database selection)
npx create-payload-app
```

**Step 3: Navigate to the new project and install dependencies**

```bash
# Navigate to the new Payload project (replace 'my-payload-cms' with your chosen project name)
cd my-payload-cms

# Install dependencies
pnpm install
```

Start the Payload development server:

```bash
pnpm dev
```

A localhost environment will spin up where you can log into the admin page, and see the existing collections.

### 4. Generate your Payload API key

Before you can generate an API key, you need to ensure your Users collection is configured to support API keys. You will need to ensure your `src/collections/Users.ts` file includes the field for auth with `useAPIKey: true`.

```typescript
export const Users: CollectionConfig = {
  ...
  auth: {
    useAPIKey: true, // This enables API key authentication
  },
  ...
}
```

Now generate your API key:

1. In the Payload admin panel (`http://localhost:3000/admin`), go to **Users** and select your admin user
2. Check the **Enable API Key** checkbox
3. Copy the API key which you'll be using for the Makeswift app's `PAYLOAD_ACCESS_TOKEN`
4. Note the user slug from the URL (e.g., if the URL is `/admin/collections/users/63f8b2a1c4d5e6f7g8h9i0j1`, then `63f8b2a1c4d5e6f7g8h9i0j1` is your user slug) - you'll use this for the Makeswift app's `PAYLOAD_USER_SLUG`

### 5. Configure main project environment variables

Navigate back to the Next.js project root and create a `.env.local` file:

```bash
cd ../payload-simple
```

Add your credentials to `.env.local`:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
PAYLOAD_ACCESS_TOKEN=your_payload_api_key_from_step_4
PAYLOAD_USER_SLUG=your_payload_user_slug_from_step_4
NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Note: The Payload server runs on port 3000, while your main Next.js app will run on port 3001.

### 6. Configure Makeswift host URL

In your Makeswift site settings, set your host URL to `http://localhost:3001/`. This is required for the Makeswift builder to properly connect to your development server.

1. Go to your [Makeswift dashboard](https://app.makeswift.com/)
2. Select your site
3. Navigate to **Settings** → **Host**
4. Set the host URL to `http://localhost:3001/`

### 7. Generate TypeScript types

Install dependencies and generate TypeScript types from your Payload GraphQL schema:

```bash
pnpm install
pnpm run codegen-ts
```

This command watches for changes and regenerates types automatically.

### 8. Run the development server

```bash
pnpm run dev
```

Your site will be available at `http://localhost:3001`. Ensure the Payload server continues running in your separate `my-payload-cms/` directory on port 3000.

## Content Model

You'll need to configure your separate Payload installation with the necessary collections for a blog. This project expects the following structure:

### Collections Overview

You'll need to have these collections in your separate Payload installation. Here are the exact collection configurations you need:

#### Posts Collection (`src/collections/Posts.ts`)

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'feedDate',
      type: 'date',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
```

#### Users Collection (`src/collections/Users.ts`)

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    useAPIKey: true,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
```

#### Media Collection (`src/collections/Media.ts`)

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
```

Don't forget to import and add these collections to your `payload.config.ts` file in your separate Payload installation:

```typescript
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'

export default buildConfig({
  // ... other config
  collections: [Posts, Users, Media],
  // ... rest of config
})
```

## Creating a Blog Post

To create a new blog post in your Payload CMS:

1. **Open your Payload Admin Panel**  
   Navigate to your Payload instance (e.g., [http://localhost:3000/admin](http://localhost:3000/admin)) and log in with your admin credentials.

2. **Go to the Posts Collection**  
   In the sidebar, click on **Posts**.

3. **Add a New Post**  
   Click the **Create New** button.

4. **Fill in the Required Fields**
   - **Title**: The headline of your blog post.
   - **Slug**: The unique URL identifier (e.g., `welcome-to-the-blog`). This will be used in the blog post URL.
   - **Banner**: Upload a hero image for your post (select from the Media library or upload a new image).
   - **Feed Date**: The date the post should appear in the blog feed.
   - **Body**: Add your post content using the rich text editor.
   - **Author**: Select an author from the Users collection.

5. Click **Save** on the top right.

Once saved, your post will automatically appear on your site at `/blog/[slug]` and in the blog feed.

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from Payload based on their slug. You don't need to manually add or publish each blog post in Makeswift—once a post is published in Payload, it will automatically appear on your site.

By default, the blog post layout includes the essential elements you'd expect: title, date, author, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your any of your blog post pages by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
2. In the builder's navigation sidebar, switch to the Elements tab and click on the _Blog footer_ element to select it.
3. In the Properties sidebar, uncheck the _Use fallback_ checkbox to display the _Blog footer_ slot on the page.
4. You can now drag and drop any components into the slot. For example, to display a list of recent posts on each blog page, you can add the Blog Feed component included with this integration. Once you publish your changes, they’ll appear on every page under `/blog/[slug]`.

You can also use the same Blog Feed component to build your blog index page (`/blog/`). Simply create a new page with that path in the builder, then add the Blog Feed component along with any other content you’d like to include. To control how many posts are displayed, adjust the component’s _Items per page_ property in the Properties sidebar.

## Development Guide

### GraphQL Code Generation

Types are automatically generated from your Payload GraphQL schema. The configuration is in `graphql.config.ts` and types are output to `generated/payload.ts`.

The GraphQL endpoint is automatically provided by your separate Payload installation at `http://localhost:3000/api/graphql`. Authentication is handled using the API key generated in the Payload admin panel.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [`vibes/README.md`](vibes/README.md) for more details.

- **BlogPostList** – Displays a grid of blog post cards.
- **BlogPostContent** – Renders individual blog post content with breadcrumbs.
- **SectionLayout** – Provides consistent spacing and layout structure.

### Content Formatting

Blog posts are transformed from Payload's structure to match the API expected by the VIBES components using utility functions in [`lib/payload/format.ts`](lib/payload/format.ts).

## Troubleshooting

Common issues and solutions:

- **Type generation fails**
  - Ensure your separate Payload instance is running on localhost:3000.
  - Check that your Payload access token is correct in `.env.local`.
  - Verify that the GraphQL endpoint is accessible at `http://localhost:3000/api/graphql`.
  - Ensure that the relevant content is published in Payload and the collections are properly configured.

- **Payload admin access issues**
  - Verify that MongoDB is running and accessible.
  - Check that `DATABASE_URI` is correctly set in your Payload `.env` file.
  - Ensure `PAYLOAD_SECRET` is set and consistent.
  - Try restarting the Payload development server.

- **Makeswift builder issues**
  - Clear your browser cache and refresh the page.
  - Make sure the `MAKESWIFT_SITE_API_KEY` is correctly set.
  - Verify that your host URL is set to http://localhost:3001/ in your Makeswift site settings.
  - Ensure your Payload instance is running and accessible from the main app.

- **GraphQL errors**
  - Run `pnpm run codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced collections (e.g., **Users**, **Posts**, **Media**) exist and are properly configured.
  - Verify API key authentication is working by testing the GraphQL endpoint directly.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload GraphQL Documentation](https://payloadcms.com/docs/graphql/overview)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
