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
│   ├── AlgoliaSearch/            # Search component integration
│   │   ├── client.tsx            # Main search UI component
│   │   └── register.ts           # Makeswift component registration
│   └── Navigation/               # Navigation component
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
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=temp_index
ALGOLIA_SITE_VERIFICATION=placeholder
```

**MAKESWIFT_SITE_API_KEY**: Automatically applied, found in your Makeswift site settings

You will be prompted for:

- **NEXT_PUBLIC_ALGOLIA_APP_ID**: Your Algolia Application ID from step 1
- **NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY**: Your Algolia Search API Key from step 1
- **NEXT_PUBLIC_ALGOLIA_INDEX_NAME**: Use a placeholder like `temp_index` for now. You'll update this in step 9 after creating your crawler
- **ALGOLIA_SITE_VERIFICATION**: Use a placeholder like `placeholder` for now. You'll get the real value in step 5 after deploying

The CLI should start up your development environment automatically, but if you need to run the server manually use:

```bash
npm run dev
```

### 4. Deploy your site and set up Makeswift host

> **Note**: You need to deploy first to get a domain URL. The Algolia domain verification will be configured after deployment.

1. Deploy your site to your hosting platform (Vercel, Netlify, etc.)
   - It's okay that `ALGOLIA_SITE_VERIFICATION` and `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` are using placeholders for now
2. Configure your custom host in Makeswift:
   - Open the [Makeswift builder](https://app.makeswift.com)
   - Navigate to **Settings** → **Host** (accessible from the left sidebar)
   - Set the **Custom host URL** field to your deployed domain (e.g., `https://your-site.vercel.app`)
   - Save your changes
3. Create and publish some pages in Makeswift to have content for indexing
   - **Important**: Make sure your pages have a title and description set for them to be properly crawled and indexed by Algolia
   - **Important**: Add links to your pages on the home page. The Algolia crawler discovers pages by following links from your start URL, so any page you want indexed must be reachable through navigation links

### 5. Get Algolia domain verification key

Now that you have a deployed domain, you can get the verification key:

1. Navigate to the [Algolia Crawler Getting Started guide](https://www.algolia.com/doc/tools/crawler/getting-started/create-crawler/)
2. Follow the "Add domains" section to add your deployed domain (e.g., `https://your-site.vercel.app`)
3. In the domain verification section, choose the **Meta tag** method
4. Copy the verification code from the meta tag (the value on content=`verification-code`)

You can find this verification code applied in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  other: {
    'algolia-site-verification': env.ALGOLIA_SITE_VERIFICATION,
  },
}
```

### 6. Update verification key and redeploy

1. Update your **local** `.env.local` with the verification code:

   ```bash
   ALGOLIA_SITE_VERIFICATION=your_actual_verification_code
   ```

2. Update the `ALGOLIA_SITE_VERIFICATION` environment variable in your hosting platform (Vercel, Netlify, etc.)
3. **Redeploy your site** so the verification meta tag appears on your live site

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

### 9. Update Your Index Name

After creating the crawler, you need to update both your local and production environments with the actual index name:

1. Check the index name created by your crawler:
   - In the crawler's **Overview** tab, find the associated index name in the "Indices" card at the bottom (e.g., `makeswift_site_pages`, `my_blog_pages`, etc.)

2. Update your **local** `.env.local` file:

   ```bash
   NEXT_PUBLIC_ALGOLIA_INDEX_NAME=your_actual_index_name_pages
   ```

3. Update the `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` environment variable in your hosting platform and redeploy your site

4. Restart your development server if it's running:
   ```bash
   npm run dev
   ```

Your search component will now query the correct index in both local and production environments!

## Building Search Pages in Makeswift

This integration includes a powerful search component that you can add to any Makeswift page:

### Using the Search Component

You can find the search component being used in the navigation bar, but you can also find it available in the component tray.

1. In the [Makeswift builder](https://docs.makeswift.com/product/builder-basics), open any page or create a new one
2. In the builder's left sidebar, find the **Algolia Search** component and drag it onto your page
3. Configure the component properties:
   - **Placeholder text**: Customize the search input placeholder (default: "Search...")
   - **Initial results to show**: Number of results displayed initially (default: 8)
   - **Results per pagination**: Number of additional results to load when users click "Show more" (default: 8)

### Search Component Features

The Algolia Search component includes:

- **Real-time search**: Results update as users type (debounced for performance)
- **Keyboard navigation**: Arrow keys to navigate results, Enter to select
- **Click outside to close**: Intuitive UX for search results
- **Pagination**: "Show more" button to load additional results
- **Typo tolerance**: Algolia's built-in typo tolerance for better search experience
- **Responsive design**: Works on all device sizes

### How the Crawler Discovers Pages

The Algolia crawler discovers pages by **following links** starting from your home page:

1. **Link-Based Discovery**: The crawler starts at your start URL (home page) and follows all links it finds to discover other pages
2. **Navigation is Key**: Make sure your pages are linked from your home page or from other pages that are linked from the home page
3. **Unreachable Pages Won't Be Indexed**: Any page that isn't reachable through links from the start URL won't be crawled

### Index Population Process

1. **Page Publishing**: When you publish a page in Makeswift, it becomes available at its URL
2. **Ensure Page is Linked**: Add a link to the new page from your home page or navigation
3. **Crawler Run**: When the crawler runs, it follows links and discovers the new page
4. **Content Extraction**: The crawler visits the new page and extracts searchable content
5. **Index Update**: The extracted content is added to your Algolia search index

> **Tip**: Configure the sitemap in your crawler settings (step 8.5) to give the crawler additional entry points for discovering pages.

### Re-crawling After Publishing New Content

The crawler doesn't automatically detect new pages—you need to trigger a re-crawl:

1. **Manual re-crawl**: In Algolia's crawler dashboard, click **Restart crawling** to immediately crawl your site
2. **Scheduled crawls**: Configure automatic crawls in the crawler's **Settings** → **Schedule** section (e.g., daily, weekly)
3. **URL testing**: Use the **URL Tester** in the crawler dashboard to test if a specific page is being crawled correctly before running a full crawl

> **Note**: After publishing new pages in Makeswift, remember to trigger a re-crawl or wait for the next scheduled crawl for the new content to appear in search results.

### Content Extraction

The crawler automatically extracts:

- **Page titles** from `<title>` tags and `<h1>` elements
- **Meta descriptions** from `<meta name="description">` tags
- **Main content** from page body, excluding navigation and footer
- **Images** from `<img>` tags and `<meta property="og:image">` tags
- **URLs** for result navigation

### Makeswift Integration

The search component is registered as a Makeswift component with configurable properties:

```typescript
runtime.registerComponent(
  lazy(() => import('./client')),
  {
    type: 'AlgoliaSearch',
    label: 'Algolia Search',
    props: {
      className: Style(),
      placeholder: TextInput({ label: 'Placeholder text', defaultValue: 'Search...' }),
      maxResults: Number({ label: 'Initial results to show', defaultValue: 8, min: 1, max: 50 }),
      paginationLimit: Number({
        label: 'Results per pagination',
        defaultValue: 8,
        min: 1,
        max: 20,
      }),
    },
  }
)
```

This allows content creators to customize the search experience directly in the Makeswift builder.

## Troubleshooting

Common issues and solutions:

### Search not working

- **Check environment variables**: Ensure all Algolia credentials are correctly set in `.env.local`
- **Verify API keys**: Make sure you're using the search API key (not admin key) for client-side usage
- **Check index name**: Verify the index name matches between your environment variables and Algolia dashboard

### No search results

- **Crawler status**: Check your crawler status in the Algolia dashboard under **Data sources** → **Crawler** → **Your crawler**
- **Index population**: Ensure the crawler has successfully populated the index (check **Data sources** → **Indices** to see if records exist)
- **Index name mismatch**: Verify that `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` in your `.env.local` exactly matches the index name shown in your Algolia dashboard
- **Search attributes**: Verify your pages contain the expected attributes (`title`, `description`, etc.)
- **Publishing status**: Make sure your Makeswift pages are published and accessible

### Crawler not indexing pages

- **Pages must be linked**: The crawler discovers pages by following links. Make sure your pages are linked from your home page or navigation
- **Page accessibility**: Check that your pages are publicly accessible (not behind authentication)
- **Crawler configuration**: Verify the start URL in your crawler settings points to your home page

### New pages not appearing in search

- **Trigger a re-crawl**: The crawler doesn't automatically detect new pages. Go to Algolia's crawler dashboard and click **Restart crawling**
- **Check crawler schedule**: If you've configured scheduled crawls, new pages will appear after the next scheduled run
- **Verify page is linked**: Make sure the new page is reachable through links from your home page or is included in your sitemap

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Algolia Crawler Documentation](https://www.algolia.com/doc/tools/crawler/)
- [Algolia Search API Reference](https://www.algolia.com/doc/api-reference/search-api/)
- [React InstantSearch Documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
