---
"@makeswift/runtime": minor
---

BREAKING: Removes the `DraftModeScript` and `PreviewModeScript` from the runtime. These components are no longer needed for integrating a site with Makeswift, and can be safely removed from any existing code.

If you're using App Router, you can remove the import and use of `DraftModeScript` from your layouts:

```diff src/app/layout.tsx
import { draftMode } from "next/headers";
- import { DraftModeScript } from "@makeswift/runtime/next/server";
import { MakeswiftProvider } from "@/makeswift/provider";
import "@/makeswift/components";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
-      <head>
-         <DraftModeScript />
-       </head>
      <body>
        <MakeswiftProvider previewMode={(await draftMode()).isEnabled}>
          {children}
        </MakeswiftProvider>
      </body>
    </html>
  );
}
```

If you're using Pages Router, can you remove the import and use of `PreviewModeScript` from your documents:

```diff src/pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";
- import { PreviewModeScript } from "@makeswift/runtime/next";
import { Document } from "@makeswift/runtime/next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
-          <PreviewModeScript isPreview={this.props.__NEXT_DATA__.isPreview} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

If your Makeswift site is [deployed with Docker](/developer/guides/deploying/docker), the `MAKESWIFT_DRAFT_MODE_PROXY_FORCE_HTTP` environment variable is no longer used. You can safely remove it from your Docker build.