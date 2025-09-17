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

### 1. Clone the repository

```bash
npx makeswift@latest init --example=algolia-demo
```

### 2. Configure environment variables

Create a `.env.local` file and add your credentials:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_algolia_search_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=your_algolia_index_name
ALGOLIA_SITE_VERIFICATION=your_algolia_site_verification
```

### 3. Get Algolia site verification key

Before setting up the crawler, you need to get your domain verification key from Algolia:

1. Navigate to the [Algolia Crawler Getting Started guide](https://www.algolia.com/doc/tools/crawler/getting-started/create-crawler/)
2. Follow the "Add domains" section to add your domain
3. In the domain verification section, choose the **Meta tag** method
4. Copy the verification code from the meta tag (the value after `algolia-site-verification`)
5. Add this code to your `.env.local` file as `ALGOLIA_SITE_VERIFICATION`

The verification meta tag is already included in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  other: {
    'algolia-site-verification': env.ALGOLIA_SITE_VERIFICATION,
  },
}
```

### 4. Deploy your site and set up Makeswift host

1. Deploy your site to your hosting platform (Vercel, Netlify, etc.)
2. In your Makeswift dashboard, set your deployed domain as the custom host
3. Create and publish some pages in Makeswift to have content for indexing

### 5. Verify domain ownership in Algolia

1. Once your site is deployed with the verification meta tag, return to the Algolia Crawler dashboard
2. Click **Verify now** next to your domain
3. Algolia will confirm ownership by detecting the meta tag on your live site

### 6. Create Algolia Crawler

After your domain is verified, you can create the crawler:

1. In the [Algolia Crawler](https://crawler.algolia.com/) dashboard, click "New Crawler"
2. Enter your crawler configuration:
   - **Crawler name**: A descriptive name
   - **App ID**: Your Algolia application ID
   - **Start URL**: Your domain's home page
   - **Crawler template**: Select the default template
3. Click **Create** to run the initial test crawl

The crawler will automatically extract:

- Page titles
- Meta descriptions
- Main content text
- Main image
- URLs

### 7. Install dependencies and run development server

```bash
pnpm install
pnpm dev
```

Your site will be available at `http://localhost:3000`.

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

### Automatic Page Discovery

The integration automatically helps Algolia discover all your Makeswift pages through:

1. **Sitemap Generation**: The `app/sitemap.ts` file automatically generates a sitemap containing all published Makeswift pages
2. **Crawler Configuration**: Point your Algolia crawler to your sitemap URL for automatic page discovery
3. **Continuous Updates**: When you publish new pages in Makeswift, they're automatically added to the sitemap

### Index Population Process

1. **Page Publishing**: When you publish a page in Makeswift, it becomes available at its URL
2. **Sitemap Update**: The sitemap automatically includes the new page
3. **Crawler Detection**: The Algolia crawler detects the sitemap changes (if configured)
4. **Content Extraction**: The crawler visits the new page and extracts searchable content
5. **Index Update**: The extracted content is added to your Algolia search index

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
- **Verify API keys**: Make sure you're using the search-only API key (not admin key) for client-side usage
- **Check index name**: Verify the index name matches between your environment variables and Algolia dashboard

### No search results

- **Crawler status**: Check your crawler status in the Algolia dashboard
- **Index population**: Ensure the crawler has successfully populated the index
- **Search attributes**: Verify your pages contain the expected attributes (`title`, `description`, etc.)
- **Publishing status**: Make sure your Makeswift pages are published and accessible

### Crawler not indexing pages

- **Sitemap accessibility**: Verify your sitemap is accessible at `/sitemap.xml`
- **Page accessibility**: Check that your pages are publicly accessible (not behind authentication)
- **Crawler configuration**: Verify start URLs and sitemap URLs in crawler settings

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Algolia Crawler Documentation](https://www.algolia.com/doc/tools/crawler/)
- [Algolia Search API Reference](https://www.algolia.com/doc/api-reference/search-api/)
- [React InstantSearch Documentation](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
