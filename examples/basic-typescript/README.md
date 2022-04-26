# Basic TypeScript Example with Next.js

## Demo

https://makeswift-examples-basic-typescript.vercel.app/

## How to use

1. Download the example:

```bash
npx degit makeswift/makeswift/examples/basic-typescript basic-typescript
cd basic-typescript
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Update the `.env` file to include your Makeswift site's API key:

```diff
   MAKESWIFT_API_HOST=https://api.makeswift.com
-- MAKESWIFT_SITE_API_KEY=
++ MAKESWIFT_SITE_API_KEY=<YOUR_MAKESWIFT_SITE_API_KEY>
```

4. Run the local dev script:

```bash
yarn dev
# or
npm run dev
```

Your host should be up and running on http://localhost:3000.

5. Finally, go to your Makeswift site settings and add http://localhost:3000/makeswift as the custom host preview URL and you're all set!
