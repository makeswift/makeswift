import { Document } from '@makeswift/runtime/next/document'

export default class MyDocument extends Document {
  static defaultProps = {
    appOrigin: process.env.MAKESWIFT_APP_ORIGIN,
  }
}
