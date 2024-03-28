import { Html, Head, Main, NextScript } from "next/document";
import { Document, PreviewModeScript } from "@makeswift/runtime/next";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <PreviewModeScript isPreview={this.props.__NEXT_DATA__.isPreview} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
