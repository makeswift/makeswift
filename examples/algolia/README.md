# Makeswift + Algolia Integration

This integration demonstrates how to combine the power of Algolia's search capabilities with Makeswift's visual page building platform. Build visually editable websites with fast, intelligent search powered by Algolia's crawler that automatically indexes your Makeswift pages.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [Algolia](https://www.algolia.com/) account (for search indexing) [Sign up for free](https://www.algolia.com/users/sign_up)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
algolia-demo/
├── app/                          # Next.js App Router pages
│   ├── [[...path]]/              # Dynamic Makeswift routes
│   ├── api/makeswift/            # Makeswift API routes
│   ├── layout.tsx                # Root layout with Makeswift provider
│   ├── globals.css               # Global styles
│   └── sitemap.ts                # Auto-generated sitemap for SEO
├── components/                   # Makeswift components
│   ├── AlgoliaSearch/            # Search component (used by Navigation)
│   │   └── client.tsx            # Main search UI component
│   └── Navigation/               # Navigation component with search
├── lib/                          # Utility functions and configs
│   ├── algolia/                  # Algolia client configuration
│   ├── makeswift/                # Makeswift runtime & provider setup
│   └── utils.ts                  # Shared utilities
├── vibes/soul/                   # Pre-built UI components
└── env.ts                        # Environment variable validation
```

## Quick Start

### 1. Set up Algolia

Before cloning the repository, you'll need to set up your Algolia account and get your API credentials:

#### Create an Algolia Account

1. [Sign up for a free Algolia account](https://www.algolia.com/users/sign_up) if you don't have one
2. If you need to create a new application, go to **Settings** → **Applications** and click **New Application**
   - You can use an existing application if you already have one

#### Get Your API Credentials

1. In your Algolia dashboard, navigate to **Settings** → **API Keys**
2. Note down the following credentials (you'll need them when initializing the project):
   - **Application ID** (`NEXT_PUBLIC_ALGOLIA_APP_ID`) - Found at the top of the API Keys page
   - **Search API Key** (`NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`) - Found in the "Your API Keys" section

> **Important**: Use the **Search API Key**, not the Admin API Key. The search key is safe to use in your frontend code.

> **Note**: You don't need to manually create an index yet. When you create your Algolia Crawler in step 8, it will automatically create the necessary indices to store your crawled content.

### 2. Clone the example with the Makeswift CLI

Initialize the project with the Makeswift CLI:

```bash
npx makeswift@latest init --example=algolia
```

### 3. Configure environment variables (initial setup)

Here is how your `.env.local` should look once setup is finished:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
ALGOLIA_SITE_VERIFICATION=placeholder
NEXT_PUBLIC_SITE_URL=https://example.com
```

**MAKESWIFT_SITE_API_KEY**: Automatically applied, found in your Makeswift site settings

You will be prompted for:

- **NEXT_PUBLIC_ALGOLIA_APP_ID**: Your Algolia Application ID from step 1
- **NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY**: Your Algolia Search API Key from step 1
- **ALGOLIA_SITE_VERIFICATION**: Use a placeholder like `placeholder` for now. You'll get the real value in step 5 after deploying
- **NEXT_PUBLIC_SITE_URL**: Use a placeholder like `https://example.com` for now. Update this with your deployed domain after step 4. This is used for generating the sitemap

The CLI should start up your development environment automatically, but if you need to run the server manually use:

```bash
npm run dev
```

### 4. Deploy your site and set up Makeswift host

> **Note**: You need to deploy first to get a domain URL. The Algolia domain verification will be configured after deployment.

1. Deploy your site to Vercel
   - It's okay that `ALGOLIA_SITE_VERIFICATION` is using a placeholder for now
   - Copy the generated Vercel URL (e.g., `https://your-site.vercel.app`)
2. Configure your custom host in Makeswift:
   - Open the [Makeswift builder](https://app.makeswift.com)
   - Navigate to **Settings** → **Host** (accessible from the left sidebar)
   - Set the **Custom host URL** field to your deployed domain (e.g., `https://your-site.vercel.app`)
   - Save your changes
3. Create some pages in Makeswift
   - **Important**: Make sure your pages have a title and description set for them to be properly crawled and indexed by Algolia
   - **Important**: Add links to your other pages. The Algolia crawler discovers pages by following links from your start URL, so any page you want indexed must be reachable through navigation links
4. Add links to those new pages within the Navigation component -- it should look something like this:
   <img width="1710" height="743" alt="Image" src="https://github.com/user-attachments/assets/d3f005de-f3e8-447f-bb63-25b64105371d" />

### 5. Get Algolia domain verification token

Now that you have a deployed domain, you can get the verification token:

1. Navigate to the [Algolia Crawler Getting Started guide](https://www.algolia.com/doc/tools/crawler/getting-started/create-crawler/)
2. Follow the "Add domains" section to add your deployed domain (e.g., `https://your-site.vercel.app`)
3. With the **Meta tag** tab selected, copy the token from the meta tag (the value on content=`verification-code`)

### 6. Update environment variables and redeploy

1. Update your **local** `.env.local` with the verification token and your deployed site URL:

   ```bash
   ALGOLIA_SITE_VERIFICATION=your_actual_verification_token
   NEXT_PUBLIC_SITE_URL=https://your-actual-site.vercel.app
   ```

2. Update the `ALGOLIA_SITE_VERIFICATION` and `NEXT_PUBLIC_SITE_URL` environment variables in your Vercel project settings

The verification meta tag is included in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  other: {
    'algolia-site-verification': env.ALGOLIA_SITE_VERIFICATION,
  },
}
```

3. **Redeploy your site** so the verification meta tag appears on your live site and the sitemap uses the correct domain

### 7. Verify domain ownership in Algolia

1. Once your site is redeployed with the verification meta tag, return to the Algolia Crawler dashboard under **Data sources**
2. Click **Verify now** next to your domain
3. Algolia will confirm ownership by detecting the meta tag on your live site

### 8. Create Algolia Crawler

After your domain is verified, you can create the crawler. **Important**: Creating a crawler automatically creates the associated index. The index name is automatically generated from the crawler name with the following transformations:

- Spaces are converted to underscores
- `_pages` is appended to the end
- Example: Crawler name "My Blog" → Index name `my_blog_pages`

1. In your Algolia dashboard, navigate to **Data sources** → **Crawlers** (at the bottom of the left sidebar)
2. Click **New Crawler**
3. Enter your crawler configuration:
   - **Crawler name**: Choose a descriptive name (e.g., "Makeswift Site", "My Blog", or "Production Site")
   - **Start URL**: Your deployed domain's home page (e.g., `https://your-site.vercel.app`)
   - **What types of content do you want to crawl?**: Select the content types that match your site:
     - Check **General web pages** for standard Makeswift pages
     - Check **Articles** if you have blog posts or article pages
     - Leave **Products** and **Technical documentation** unchecked unless applicable
   - **Index prefix**: Leave this field **empty** unless you want an additional prefix
4. Click **Create** to run the initial test crawl
   - The crawler will automatically create an index based on your crawler name
5. Optionally, [configure the sitemap URL](https://www.algolia.com/doc/tools/crawler/apis/configuration/sitemaps) in Algolia's crawler dashboard:
   - Under **Editor**, find the `sitemaps` array and add your sitemap URL:
     ```javascript
     sitemaps: ["https://your-site.vercel.app/sitemap.xml"],
     ```
   - Click **Save** to apply your changes
   - URLs found in sitemaps are treated as start URLs for the crawler, giving the crawler more entry points to discover your pages

> **How the crawler discovers pages**: The crawler starts at your start URLs (including any URLs from sitemaps) and follows links to discover other pages. Make sure all pages you want indexed are either in the sitemap or linked from your home page. Pages that aren't reachable won't be crawled.

The crawler will automatically extract:

- Page titles
- Meta descriptions
- Main content text
- Main image
- URLs

### 9. Configure Your Index Name in Makeswift

After creating the crawler, configure the index name directly in the Makeswift builder:

1. Check the index name created by your crawler:
   - In the crawler's **Overview** tab, find the associated index name in the "Indices" card at the bottom (e.g., `makeswift_site_pages`, `my_blog_pages`, etc.)

2. Open the [Makeswift builder](https://app.makeswift.com) and navigate to any page.

3. Select the **Navigation** component at the top of the page.

4. In the component properties panel, find the **Algolia Index Name** field

5. Enter your index name (e.g., `makeswift_site_pages`)

The search feature in the Navigation component will now search that index.

## Search Features

The search functionality is built into the Navigation component. When users click the search icon in the navigation bar, a search overlay appears with the following features:

- **Real-time search**: Results update as users type (debounced for performance)
- **Keyboard navigation**: Arrow keys to navigate results, Enter to select
- **Click outside to close**: Intuitive UX for search results
- **Pagination**: "Show more" button to load additional results
- **Typo tolerance**: Algolia's built-in typo tolerance for better search experience
- **Responsive design**: Works on all device sizes

### How the Crawler Discovers Pages

The Algolia crawler discovers pages by **following links** starting from your home page:

1. **Link-Based Discovery**: The crawler starts at your start URL (home page) and follows all links it finds to discover other pages
2. **Navigation is Key**: Make the links you want crawled are reachable from the home page (i.e. from the Navigation).
3. **Unreachable Pages Won't Be Indexed**: Any page that isn't reachable through links from the start URL won't be crawled

### Index Population Process

1. **Page Publishing**: When you publish a page in Makeswift, it becomes available at its URL
2. **Ensure Page is Linked**: Add a link to the new page from your home page or navigation
3. **Crawler Run**: When the crawler runs, it follows links and discovers the new page
4. **Content Extraction**: The crawler visits the new page and extracts searchable content
5. **Index Update**: The extracted content is added to your Algolia search index

> **Note**: The `app/sitemap.ts` file generates a sitemap for SEO purposes, but the Algolia crawler primarily relies on following links rather than the sitemap.

### Content Extraction

The crawler automatically extracts:

- **Page titles** from `<title>` tags and `<h1>` elements
- **Meta descriptions** from `<meta name="description">` tags
- **Main content** from page body, excluding navigation and footer
- **Images** from `<img>` tags and `<meta property="og:image">` tags
- **URLs** for result navigation

## Troubleshooting

Common issues and solutions:

### Search not working

- **Check environment variables**: Ensure all Algolia credentials are correctly set in `.env.local`
- **Verify API keys**: Make sure you're using the search API key (not admin key) for client-side usage
- **Check index name**: Verify the index name matches between your environment variables and Algolia dashboard

### No search results

- **Crawler status**: Check your crawler status in the Algolia dashboard under **Data sources** → **Crawler** → **Your crawler**
- **Index population**: Ensure the crawler has successfully populated the index (check **Data sources** → **Indices** to see if records exist)
- **Index name mismatch**: Verify that the **Algolia Index Name** configured on the Navigation component in Makeswift exactly matches the index name shown in your Algolia dashboard
- **Search attributes**: Verify your pages contain the expected attributes (`title`, `description`, etc.)
- **Publishing status**: Make sure your Makeswift pages are published and accessible

### Crawler not indexing pages

- **Pages must be linked**: The crawler discovers pages by following links. Make sure your pages are linked from your home page or navigation
- **Page accessibility**: Check that your pages are publicly accessible (not behind authentication)
- **Crawler configuration**: Verify the start URL in your crawler settings points to your home page

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Algolia Crawler Documentation](https://www.algolia.com/doc/tools/crawler/)
- [Algolia Search API Reference](https://www.algolia.com/doc/api-reference/search-api/)
- [React InstantSearch Documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
