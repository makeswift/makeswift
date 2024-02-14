---
'@makeswift/runtime': patch
---

Update `proxy-preview-mode.ts` to remove `x-middleware-rewrite` in responses.

`NextResponse.rewrite` isn't supported in App router. 
When an app is in the builder, the request is proxied through an api route. This proxied request will hit any middleware.
If this middleware rewrites the resulting response will include the `x-middleware-rewrite` header.
When this page finally resolves the app router checks that header and will throw since it appears that we have rewritten within app router.
We want to prevent this false positive, so we remove the `x-middleware-rewrite` header from the response.

