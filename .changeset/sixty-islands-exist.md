---
'@makeswift/runtime': minor
---

Starting from version `0.13.0`, **versioning is now enabled by default**. With versioning, users can easily publish all changes to their website with just a few clicks. Published changes are saved so you can revert to previous versions if needed.

Upgrade guide from version `0.12.x` to `0.13.x`:

1. Update `getPageSnapshot` Parameters:

   a. Remove the `preview` parameter.

   b. Add the new `siteVersion` parameter.

   ```diff
     export async function getStaticProps(ctx){
      const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY, { runtime })

      const snapshot = await makeswift.getPageSnapshot(path, {
   -    preview: ctx.preview,
   +    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
        locale: ctx.locale,
      });
     }
   ```

2. For users who have **never used versioning**:

   - No further actions are required.

3. For users who have used versioning:

   a. Remove the `siteVersion` parameter from the `Makeswift` constructor.

   ```diff
     const makeswift = new Makeswift(process.env.MAKESWIFT_SITE_API_KEY, {
       runtime: runtime,
   -   siteVersion: Makeswift.getSiteVersion(ctx.previewData),
     });
   ```

   b. Remove the `siteVersion` parameter from the `MakeswiftApiHandler`.

   ```diff
      export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY, {
   -    siteVersions: true,
      });
   ```

   c. If you use `client.getPage`, you need to also update the parameters:

   ```diff
      const page = await client.getPage(path, {
   -    preview,
   +    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
        locale
      })
   ```
