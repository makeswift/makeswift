import { Document } from '@makeswift/runtime/next'

export default class MyDocument extends Document {
  static defaultProps = {
    appOrigin: process.env.MAKESWIFT_APP_ORIGIN,
  }
}
