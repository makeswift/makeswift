---
'@makeswift/runtime': minor
---

BREAKING: Add support for on-demand revalidation. This is a breaking change because
`@makeswift/runtime` now requires Next.js v12.2.0 or higher for stable on-demand revalidation
support.

If you're not using Next.js v12.2.0 or greater we will attempt to use `res.unstable_revalidate`. If
that's not available, then we'll log a warning and revalidation will be a no-op. Make sure to add a
revalidation period to `getStaticProps` if that's the case so that changes to Makeswift pages are
eventually reflected on your live pages.
