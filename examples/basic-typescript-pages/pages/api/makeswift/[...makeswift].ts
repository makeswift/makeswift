import { runtime } from "@/lib/makeswift/runtime";
import { MakeswiftApiHandler } from "@makeswift/runtime/next/server";
import { strict } from "assert";

import '@/lib/makeswift/components'

strict(
  process.env.MAKESWIFT_SITE_API_KEY,
  "MAKESWIFT_SITE_API_KEY is required"
);

export default MakeswiftApiHandler(process.env.MAKESWIFT_SITE_API_KEY, {
  runtime,
});
