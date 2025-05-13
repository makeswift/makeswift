# Makeswift + Remix Integration

This project demonstrates the integration of Makeswift with Remix, allowing you to build dynamic, visually editable pages in a Remix application.

## Implementation Details

This implementation showcases how to:

1. Dynamically render Makeswift pages in a Remix application
2. Handle browser-specific code to avoid "process is not defined" errors
3. Create and register custom Makeswift components
4. Implement dynamic routing for Makeswift pages

## Key Features

- **Dynamic Page Rendering**: Pages are dynamically rendered based on the URL path
- **Custom Components**: Custom Makeswift components (SimpleText, ContentCard)
- **Browser-Compatible**: Avoids Node.js specific code in browser context
- **Fallback Content**: Provides fallback content when Makeswift API is unavailable

## Architecture

The implementation follows these principles:

1. **Client-Side Routing**: Uses React Router to handle client-side routing
2. **Dynamic Data Fetching**: Fetches page data from Makeswift API based on current path
3. **Component Registration**: Registers custom components with Makeswift runtime
4. **Environment Variable Safety**: Handles environment variables safely in browser context

## Key Files

- `app/main.tsx`: Main entry point that loads the fixed implementation
- `app/main-fixed.tsx`: Browser-compatible implementation that avoids process.env errors
- `app/makeswift/client.ts`: Client for fetching Makeswift page data
- `app/makeswift/page.tsx`: Component for rendering Makeswift pages
- `app/makeswift/runtime.ts`: Makeswift runtime configuration
- `app/components/`: Custom components for Makeswift integration

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Access the site at `http://localhost:3000`

## Known Limitations

- The current implementation uses hardcoded fallback content for demo purposes
- For production use, you should implement proper error handling and loading states
- The Makeswift API key needs to be configured correctly for your site

## Next Steps

- Implement server-side rendering for Makeswift pages
- Add more custom components with rich functionality
- Implement proper error boundaries and loading states
- Add authentication and access control