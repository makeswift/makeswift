import { Makeswift } from "@makeswift/runtime/next";

import { getConfig } from "./config";
import { runtime } from "./runtime";

const config = getConfig()

export const client = new Makeswift(config.makeswift.siteApiKey, { runtime })
