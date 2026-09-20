import { ReactRuntime } from '@makeswift/runtime/next';

export const runtime = new ReactRuntime({
  apiOrigin: process.env.MAKESWIFT_API_ORIGIN,
});
