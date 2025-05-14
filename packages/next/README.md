# @makeswift/next

Next.js adapter for Makeswift.

This package provides the integration between Makeswift's core runtime (`@makeswift/runtime`) and Next.js. It handles Next.js-specific implementations including:

- API route handlers for preview/draft mode, webhooks, revalidation, and resource proxying
- Next.js-specific component implementations (Image, Link, etc.)
- Head management using Next.js's head components
- Draft/preview mode integration for both Pages Router and App Router
- SSR styling with Emotion
- Cache revalidation using Next.js's on-demand ISR

## Status

This package is currently under development as part of the Makeswift decoupling project. It will eventually replace the Next.js-specific functionality currently included in `@makeswift/runtime`.