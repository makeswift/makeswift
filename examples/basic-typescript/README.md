# Basic TypeScript Example with Next.js

## How to use

First, install the dependencies:

```bash
yarn install
# or
npm install
```

Then, update the `.env` file to include your Makeswift site's API key:

```diff
   MAKESWIFT_API_HOST=https://api.makeswift.com
-- MAKESWIFT_SITE_API_KEY=
++ MAKESWIFT_SITE_API_KEY=<YOUR_MAKESWIFT_SITE_API_KEY>
```

Run the local dev script:

```bash
yarn dev
# or
npm run dev
```

Your host should be up and running on http://localhost:3000.

Finally, go to your Makeswift site settings and add http://localhost:3000/makeswift as the custom host preview URL and you're all set!
