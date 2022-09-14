# Visually build with react-three-fiber components

In this example, you'll learn how to integrate react-three-fiber components from your Next.js app into [Makeswift](https://www.makeswift.com) to make it visually editable.

## Demo

[https://makeswift-examples-react-three-fiber.vercel.app/](https://makeswift-examples-react-three-fiber.vercel.app/)

## Deploy your own

Deploy your own with [Vercel](https://vercel.com/new/git/external?repository-url=https://github.com/makeswift/makeswift/tree/main/examples/react-three-fiber&project-name=makeswift-react-three-fiber-example&repository-name=makeswift-react-three-fiber-example&env=MAKESWIFT_SITE_API_KEY&envDescription=The%20API%20key%20for%20your%20Makeswift%20site&envLink=https%3A%2F%2Fwww.makeswift.com%2Fdocs%2Fguides%2Fgetting-started%23configure-the-makeswift-site-api-key) or preview live with [StackBlitz](https://stackblitz.com/github/makeswift/makeswift/tree/main/examples/react-three-fiber)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/makeswift/makeswift/tree/main/examples/react-three-fiber&project-name=makeswift-react-three-fiber-example&repository-name=makeswift-react-three-fiber-example&env=MAKESWIFT_SITE_API_KEY&envDescription=The%20API%20key%20for%20your%20Makeswift%20site&envLink=https%3A%2F%2Fwww.makeswift.com%2Fdocs%2Fguides%2Fgetting-started%23configure-the-makeswift-site-api-key)

## Tools

- [**three.js**](https://threejs.org/docs/): the underlying library for creating amazing 3d scenes.
- [**react-three-fiber**](https://docs.pmnd.rs/react-three-fiber/): react bindings for three.js.
- [**Makeswift SDK**](https://www.makeswift.com/docs): to register components into Makeswift's visual builder.

https://console.cloud.google.com/google/maps-apis/credentials

## Using this repo

1. **Clone the example**

   ```bash
   npx makeswift init --example=react-three-fiber
   ```

2. **Optional: Add Google Maps API Key**

   In order to search addresses for locations, you'll need to generate an API key for Google Maps in the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials) and add it to your `.env.local` file.

   ```diff
   - GOOGLE_MAPS_API_KEY=
   + GOOGLE_MAPS_API_KEY=<YOUR_API_KEY>
   ```

---

## Next steps

With Makeswift, you can give your marketing team hand-crafted react-three-fiber building blocks to create custom 3d websites.

To learn more about Makeswift, take a look at the following resources:

- [Makeswift Website](https://www.makeswift.com/)
- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Discord Community](https://discord.gg/dGNdF3Uzfz)

You can check out [the Makeswift GitHub repository](https://github.com/makeswift/makeswift) - your feedback and contributions are welcome!
