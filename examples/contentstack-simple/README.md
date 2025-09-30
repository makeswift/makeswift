# Makeswift + Contentstack Integration

This integration demonstrates how to combine the power of Contentstack's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in Contentstack but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [Contentstack](https://www.contentstack.com/) account (for content management) [Sign up for free](https://www.contentstack.com/contact-us)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. [Learn more here](https://docs.makeswift.com/developer/app-router/installation).

## Project Structure

```
contentstack-simple/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog-related routes
│   │   ├── [slug]/               # Dynamic blog post pages
│   ├── api/makeswift/            # Makeswift API routes
│   ├── [[...path]]/              # Dynamic Makeswift routes
├── components/                   # Generic components
├── lib/                          # Utility functions and configs
│   ├── contentstack/             # Contentstack utilities
│   └── makeswift/                # Makeswift configuration
├── generated/                    # Auto-generated TypeScript types
├── vibes/soul/                   # Pre-built UI components
└── env.ts                        # Environment variable validation
```

## Getting started

### 1. Set up Contentstack

Before cloning the repository, you'll need to prepare your Contentstack account:

1. **Log in to Contentstack** and select (or create) your stack
2. **Create an environment:**
   - Go to **Settings** → **Environments**
   - Click **+ New Environment**
   - Name it (e.g., "development" or "production")
   - Click **Save**
3. **Create a delivery token:**
   - Go to **Settings** → **Tokens**
   - Click **+ New Token** under the "Delivery Tokens" section
   - Give it a name (e.g., "Website Delivery Token")
   - Under **Scope**, select your desired branch, and publishing environments
   - Click **Generate Token**

You will now be able to copy these relevant API keys.

### 2. Set up your content model in Contentstack

To get started with blog posts, you'll need to set up a content model in Contentstack. Here's how we did it:

**Navigate to Content Models:**

1. Log in to your Contentstack account
2. Select your stack from the dashboard
3. At the top navigation, click on **Content Models**

Note: Content models will come with a single default `Display Name` called "Title" and a `Unique ID (uid)` that cannot be modified. For other created fields we recommend you ensure the Display Name and Unique ID match.

**Create a new content type called "Author":**

1. Click the **+ New Content Type** button
2. Set the title to "Author" and click **Create**
3. Set the type to **Multiple**, this allows you to create multiple author entries
4. Click into the new type, and match the following fields:
   - **Name** (Single Line Textbox: `name`) - Rename the **Title** field with this one (note that GraphQL will use "title" since we cannot change the uid)
   - **Slug** (Single Line Textbox: `slug`) - URL-friendly identifier
     - Under the **Advanced** section, check **Mandatory** to make this field required
   - **Description** (Multi Line Textbox: `description`) - Author bio
5. Click **Save** in the bottom right corner

**Create a new content type called "Blog Post":**

1. Click the **+ New Content Type** button again
2. Set the title to "Blog Post" and click **Create**
3. Set the type to **Multiple**, this allows you to create multiple blog post entries
4. Add the following fields along with the default **Title** field:
   - **Slug** (Single Line Textbox: `slug`) - URL-friendly identifier
     - Under the **Advanced** section, check **Mandatory** to make this field required
     - Under the **Advanced** section, check **Unique** to prevent duplicate slugs
   - **Description** (Multi Line Textbox: `description`) - Brief summary
   - **Body** (Rich Text Editor: `body`) - Main content
   - **Banner** (File: `featured_image`) - Hero image
   - **Feed Date** (Date: `feed_date`) - Visible publication date
   - **Author** (Reference: `author`) - Who wrote it
     - When adding this field, select "Author" as the referenced content type
5. Click **Save** in the bottom right corner

Be sure to add a few blog posts for testing purposes, and connect them to an author.

### 3. Clone the repository

```bash
npx makeswift@latest init --example=contentstack-simple
```

### 4. Configure environment variables

Here is how your `.env.local` should look once setup is finished:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
CONTENTSTACK_API_KEY=your_contentstack_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_ENVIRONMENT=your_environment_name
CONTENTSTACK_REGION=US
NEXT_PUBLIC_SITE_URL=your_site_url
```

**MAKESWIFT_SITE_API_KEY**: Automatically applied, found in your Makeswift site settings

You will be prompted for:

**CONTENTSTACK_API_KEY**: The "Stack API Key" from step 1 (Set up Contentstack)
**CONTENTSTACK_DELIVERY_TOKEN**: The "Delivery Token" from step 1 (Set up Contentstack)
**CONTENTSTACK_ENVIRONMENT**: The environment name you created in step 1 (e.g., "development" or "production")
**CONTENTSTACK_REGION**: Choose from US, EU, AZURE_NA, AZURE_EU, or GCP_NA based on your stack's region
**NEXT_PUBLIC_SITE_URL**: Your site's base URL used for generating links (e.g., `http://localhost:3000` for local development)

The development environment should start up automatically, but if you need to run the server manually, use:

```bash
npm run dev
```

Once your development server is running, go back to your Makeswift site settings and set the **Host URL** to `http://localhost:3000`.

### 5. Add content to Contentstack

Now that your site is running, create some content entries to display:

**Navigate to Entries:**

1. In the left sidebar of your Contentstack dashboard, click on **Entries**
2. You'll see a dropdown list of all your content types

**Create an Author entry:**

1. Click on **Author** in the Entries section
2. Click the **+ New Entry** button in the top right
3. Fill in the required fields:
   - **Name**: The author's full name
   - **Slug**: A URL-friendly identifier (e.g., "john-doe")
   - **Description**: A short bio about the author
4. Click **Save** in the top right corner
5. Click **Publish** to make the entry live and select your environment (you'll see a green "Published" status)

**Create a Blog Post entry:**

1. Go back to **Entries** in the left sidebar
2. Click on **Blog Post** from the list
3. Click the **+ New Entry** button
4. Fill in all the required fields:
   - **Title**: Your blog post title
   - **Slug**: A URL-friendly version (e.g., "my-first-post")
   - **Description**: A brief summary (this will appear in blog listings)
   - **Body**: Your main blog content using the rich text editor toolbar
   - **Banner**: Click the field and upload an image (or choose from your Assets library)
   - **Feed Date**: Click to open the date picker and select a publication date
   - **Author**: Click the field and select the author entry you created earlier from the list
5. Click **Save** in the top right corner
6. Click **Publish** to make the entry live and select your environment

**Tips:**

- You can create multiple authors and blog posts by repeating the steps above
- Use the **Save as Draft** option if you're not ready to publish yet
- Once published, blog posts will automatically appear on your site at `/blog/[slug]`
- You can edit entries anytime by clicking on them in the Entries list

If you modify the GraphQL queries in the future, run the following command to regenerate types:

```bash
npm run codegen-ts-watch
```

This will regenerate the GraphQL types and watch for changes.

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from Contentstack based on their slug. The blog posts you created in step 6 are now live on your site at `/blog/[slug]` (e.g., if you created a post with slug "my-first-post", it's available at `/blog/my-first-post`).

By default, the blog post layout includes the essential elements you'd expect: title, date, author, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to one of your blog post pages by entering its URL (e.g., `/blog/my-first-post`) in the builder's URL bar.
2. In the builder's navigation sidebar, switch to the **Elements** tab and click on the _Blog footer_ element to select it.
3. In the **Properties** sidebar, uncheck the _Use fallback_ checkbox to display the _Blog footer_ slot on the page.
4. You can now drag and drop any components into the slot. For example, to display a list of recent posts on each blog page, you can add the Blog Feed component included with this integration. Once you publish your changes, they’ll appear on every page under `/blog/[slug]`.

You can also use the same Blog Feed component to build your blog index page (`/blog`). Simply create a new page with the path `/blog` in the builder, then add the Blog Feed component along with any other content you'd like to include. To control how many posts are displayed, adjust the component's _Items per page_ property in the **Properties** sidebar.

## Development Guide

### GraphQL Code Generation

Types are automatically generated from your Contentstack schema. The configuration is in `graphql.config.ts` and types are output to `generated/contentstack.ts`.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [`vibes/README.md`](vibes/README.md) for more details.

- **BlogPostList** – Displays a grid of blog post cards.
- **BlogPostContent** – Renders individual blog post content with breadcrumbs.
- **SectionLayout** – Provides consistent spacing and layout structure.

### Content Formatting

Blog posts are transformed from Contentstack's structure to match the API expected by the VIBES components using utility functions in [`lib/contentstack/format.ts`](lib/contentstack/format.ts).

## Troubleshooting

Common issues and solutions:

- **Type generation fails**
  - Ensure your Contentstack credentials are correct in `.env.local`.
  - Check that your content model matches the GraphQL query.
  - Verify that the relevant content is published in Contentstack.

- **Blog posts not showing**
  - Confirm that the slug format matches your entries in Contentstack.
  - Make sure the posts are published.
  - Ensure required fields—**Title**, **Slug**, **Feed Date**, **Body**, and **Banner**—are populated.

- **Makeswift builder issues**
  - Clear your browser cache and refresh the page.
  - Make sure the `MAKESWIFT_SITE_API_KEY` is correctly set.
  - Verify that your host URL is set to `http://localhost:3000/` in your Makeswift site settings.

- **GraphQL errors**
  - Run `npm run codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced content types (e.g., **Author**, **Blog Post**) exist and are published.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Contentstack GraphQL API Reference](https://www.contentstack.com/docs/developers/apis/graphql-content-delivery-api)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
