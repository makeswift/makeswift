# Makeswift + Contentstack Integration

This integration demonstrates how to combine the power of Contentstack's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in Contentstack but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [Contentstack](https://www.contentstack.com/) account (for content management) [Sign up for free](https://www.contentstack.com/contact-us)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

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

## Quick Start

### 1. Clone the repository

```bash
   npx makeswift@latest init --example=contentstack-simple
```

### 2. Configure environment variables

Create a `.env.local` file and add your credentials:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
CONTENTSTACK_API_KEY=your_contentstack_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_ENVIRONMENT=your_environment_name
CONTENTSTACK_REGION=US
```

1. **Makeswift Site API Key**: Found in your Makeswift site settings
2. **Contentstack API Key**: Found in your Contentstack stack settings under "Settings" → "Tokens" → "Your Delivery Token"
3. **Contentstack Delivery Token**: Right under the Stack API Key
4. **Contentstack Environment**: Usually "production" or "development"
5. **Contentstack Region**: Choose from US, EU, AZURE_NA, AZURE_EU, or GCP_NA based on your stack's region

### 3. Set up your content model in Contentstack

To get started with blog posts, you'll need to set up a content model in Contentstack. Here's what how we did it:

**Navigate to Content Models:**

1. Log in to your Contentstack account
2. Select your stack from the dashboard
3. In the left sidebar, click on **Content Models**

**Create a new content type called "Author":**

1. Click the **+ New Content Type** button
2. Set the title to "Author" and click **Create**
3. Click into the new type, add the following fields by clicking **+ New Field**:
   - **Name** (Single Line Textbox: `name`) - The author's name
   - **Slug** (Single Line Textbox: `slug`) - URL-friendly identifier (make this field required and unique)
   - **Job title** (Single Line Textbox: `job_title`) - The author's job title
   - **Description** (Multi Line Textbox: `description`) - Author bio
4. Click **Save** in the bottom right corner

**Create a new content type called "Blog Post":**

1. Click the **+ New Content Type** button again
2. Set the title to "Blog Post" and click **Create**
3. Add the following fields:
   - **Title** (Single Line Textbox: `title`) - Post title
   - **Slug** (Single Line Textbox: `slug`) - URL-friendly identifier (make this field required and unique)
   - **Description** (Multi Line Textbox: `description`) - Brief summary
   - **Body** (Rich Text Editor: `body`) - Main content
   - **Banner** (File: `featured_image`) - Hero image
   - **Feed Date** (Date: `publish_date`) - Visible publication date
   - **Author** (Reference: `author`) - Who wrote it
     - When adding this field, select "Author" as the referenced content type
4. Click **Save** in the bottom right corner

### 4. Add entries to Contentstack

Once your content model is set up, you'll need to create some content entries:

**Navigate to Entries:**

1. In the left sidebar of your Contentstack dashboard, click on **Entries**
2. You'll see a dropdown list of all your content types

**Create an Author entry:**

1. Click on **Author** in the Entries section
2. Click the **+ New Entry** button in the top right
3. Fill in the required fields:
   - **Name**: The author's full name
   - **Slug**: A URL-friendly identifier (e.g., "john-doe")
   - **Job title**: The author's position
   - **Description**: A short bio about the author
4. Click **Save** in the top right corner
5. Click **Publish** to make the entry live (you'll see a green "Published" status)

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
6. Click **Publish** to make the entry live

**Tips:**

- You can create multiple authors and blog posts by repeating the steps above
- Use the **Save as Draft** option if you're not ready to publish yet
- Once published, blog posts will automatically appear on your site at `/blog/[slug]`
- You can edit entries anytime by clicking on them in the Entries list

### 5. Generate TypeScript types

```bash
npm run codegen-ts
```

This command watches for changes and regenerates types automatically.

### 6. Install dependencies

```bash
npm install
```

### 7. Run the development server

```bash
npm run dev
```

## Building Blog Pages in Makeswift

This integration includes a dynamic `/blog/[slug]` route that automatically retrieves and renders individual blog posts from Contentstack based on their slug. You don’t need to manually add or publish each blog post in Makeswift—once a post is published in Contentstack, it will automatically appear on your site.

By default, the blog post layout includes the essential elements you'd expect: title, date, author, hero image, and body content. However, the integration also allows you to visually add custom sections in Makeswift below the blog content and apply them to every blog page:

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), navigate to your any of your blog post pages by entering the post's URL (e.g., `/blog/welcome`) in the builder's URL bar.
2. In the builder's navigation sidebar, switch to the Elements tab and click on the _Blog footer_ element to select it.
3. In the Properties sidebar, uncheck the _Use fallback_ checkbox to display the _Blog footer_ slot on the page.
4. You can now drag and drop any components into the slot. For example, to display a list of recent posts on each blog page, you can add the Blog Feed component included with this integration. Once you publish your changes, they’ll appear on every page under `/blog/[slug]`.

You can also use the same Blog Feed component to build your blog index page (`/blog/`). Simply create a new page with that path in the builder, then add the Blog Feed component along with any other content you’d like to include. To control how many posts are displayed, adjust the component’s _Items per page_ property in the Properties sidebar.

## Development Guide

### GraphQL Code Generation

Types are automatically generated from your Contentstack schema. The configuration is in `graphql.config.ts` and types are output to `generated/Contentstack.ts`.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [`vibes/README.md`](vibes/README.md) for more details.

- **BlogPostList** – Displays a grid of blog post cards.
- **BlogPostContent** – Renders individual blog post content with breadcrumbs.
- **SectionLayout** – Provides consistent spacing and layout structure.

### Content Formatting

Blog posts are transformed from Contentstack’s structure to match the API expected by the VIBES components using utility functions in [`lib/contentstack/format.ts`](lib/Contentstack/format.ts).

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
  - Verify that your host URL is set to http://localhost:3000/ in your Makeswift site settings.

- **GraphQL errors**
  - Run `npm run codegen-ts` to regenerate types.
  - Check that your content model matches the structure expected by the GraphQL query.
  - Ensure all referenced content types (e.g., **Author**, **BlogPost**) exist and are published.

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Contentstack GraphQL API Reference](https://www.contentstack.com/docs/developers/apis/graphql-content-delivery-api)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
