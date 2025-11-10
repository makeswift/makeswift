# Makeswift + Payload Integration

This integration demonstrates how to combine the power of Payload's content management with Makeswift's visual page building capabilities. Build visually stunning, editable blogs—managed in Payload, designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) → [Sign up for free](https://app.makeswift.com/signup)
- A [Payload CMS](https://payloadcms.com/) installation and a local [Docker](https://www.docker.com/products/docker-desktop/) environment to run the content database (for content storage, see setup instructions below)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app) and [Payload CMS](https://payloadcms.com/)

This guide assumes you're familiar with Makeswift and setting up a custom host. To learn more, see https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
payload-simple/                   # Makeswift-powered website
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

my-payload-cms/                   # Your Payload CMS instance
├── src/                          # Payload source code
│   ├── collections/              # Payload collections (Posts, Users, Media)
│   ├── app/                      # Payload admin and API routes
│   └── payload.config.ts         # Payload configuration
├── package.json                  # Payload dependencies
└── docker-compose.yml            # Docker setup for MongoDB
```

## Getting started

### 1. Set up Payload CMS instance

First, you'll need to create a new Payload CMS installation that will serve as your content management system.

Payload can either be embedded as a route in your Next.js app or run as a standalone web app. In this guide, we’ll use the standalone setup with a local MongoDB instance running in a Docker container.

#### Bootstrap Payload CMS

In the desired parent directory, run the following command to create your Payload CMS project:

```bash
npx create-payload-app
```

The CLI will guide you through creating and setting up a new project. For any prompts with default values, we recommend accepting the defaults. When prompted for the MongoDB connection string, enter `mongodb://mongo/<your-payload-project-name>`.

After the setup is complete, navigate to your Payload project directory and start MongoDB and the development server with:

```bash
docker-compose up
```

Go to http://localhost:3000 to open the Payload app in your browser and create your admin user.

#### Set up your content model

To get started with blog posts, you’ll need to define a content model in Payload. We’ll create a Posts collection to represent individual blog entries, and update the existing Users collection to enable API key authentication and include author details:

##### Posts Collection (`src/collections/Posts.ts`)

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

##### Users Collection (`src/collections/Users.ts`)

```diff
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
-  auth: true,
+  auth: {
+    useAPIKey: true, // enable API key authentication
+  },
  fields: [
    // Email added by default
    // Add more fields as needed
+    {
+      name: 'name',
+      type: 'text',
+    },
+    {
+      name: 'avatar',
+      type: 'upload',
+      relationTo: 'media',
+    },
  ],
}
```

As the last step, add the `Posts` collection to `src/payload.config.ts`:

```diff
import { Media } from './collections/Media'
import { Users } from './collections/Users'
+ import { Posts } from './collections/Posts'

export default buildConfig({
  // ... other config
-  collections: [Users, Media],
+  collections: [Users, Media, Posts],
  // ... rest of config
})
```

When you refresh the Payload Admin dashboard, you should see the Posts collection listed alongside Users and Media.

#### Get your API credentials

To obtain the Payload credentials for the next steps:

1. In the Payload admin panel (http://localhost:3000/admin), go to **Users** and select your admin user.
2. Check the **Enable API Key** checkbox.
3. Copy the API key—you'll need this as your `PAYLOAD_ACCESS_TOKEN`.
4. Copy the user slug from the URL. For example, if the URL is `/admin/collections/users/63f8b2a1c4d5e6f7g8h9i0j1`, then `63f8b2a1c4d5e6f7g8h9i0j1` is your `PAYLOAD_USER_SLUG`.

### 2. Clone the repository

Open a new terminal session in your desired parent directory and run the following command to create a Makeswift + Payload project:

```bash
npx makeswift@latest init --example=payload-simple
```

> [!NOTE]
> In this setup, the Payload server runs on port 3000, so your main Next.js app will run on port 3001.

### 3. Configure environment variables

Here is how your `.env.local` should look once setup is finished:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
PAYLOAD_ACCESS_TOKEN=your_payload_api_key
PAYLOAD_USER_SLUG=your_payload_user_slug
NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

**MAKESWIFT_SITE_API_KEY**: Automatically applied, found in your Makeswift site settings

You will be prompted for:

**PAYLOAD_ACCESS_TOKEN**: The API key you generated in step 1
**PAYLOAD_USER_SLUG**: The user slug from step 1
**NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN**: Your Payload server URL (ex: `http://localhost:3000`)
**NEXT_PUBLIC_SITE_URL**: Your Next.js app URL (ex: `http://localhost:3001`)

The CLI should start up your development environment automatically, but if you need to run the server manually, use:

```bash
npm run dev
```

Your site will be available at http://localhost:3001. Make sure the Payload server continues running in a separate process on port 3000.

Once your development server is running, go back to your Makeswift site settings and set the **Host URL** to `http://localhost:3001`.

If you modify the GraphQL queries in the future, run the following command to regenerate types:

```bash
npm run codegen-ts-watch
```

This will regenerate the GraphQL types and watch for changes.

### 4. Add content to Payload

Now it's time to create and publish a few sample blog posts.

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
  - Ensure your Payload CMS instance is running on `http://localhost:3000`.
  - Confirm that your Payload access token is correctly set in `.env.local`.
  - Verify that the GraphQL endpoint is accessible at `http://localhost:3000/api/graphql`.
  - Check that Payload collections are properly configured.

- **Payload admin access issues**
  - Verify that the MongoDB instance in the Docker container is running and accessible.
  - Check that `DATABASE_URI` is correctly set in your Payload `.env` file.
  - Ensure `PAYLOAD_SECRET` is set and consistent.
  - Try restarting the Payload and MongoDB Docker containers (`docker-compose up`).

- **Makeswift builder issues**
  - Clear your browser cache and refresh the page.
  - Make sure the `MAKESWIFT_SITE_API_KEY` is correctly set.
  - Verify that your host URL is set to `http://localhost:3001` in your Makeswift site settings.
  - Ensure your Payload instance is running and accessible from the main app.

- **GraphQL errors**
  - Run `npm run codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced collections (e.g., **Users**, **Posts**, **Media**) exist and are correctly configured.
  - Verify API key authentication is working by testing the GraphQL endpoint directly.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload GraphQL Documentation](https://payloadcms.com/docs/graphql/overview)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
