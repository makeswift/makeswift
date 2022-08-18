import { exec } from "child_process";
import { createNextApp } from "./create-next-app";
import * as path from "path";

async function init(
  name: string,
  { example = "basic-typescript" }: { example?: string }
): Promise<void> {
  await createNextApp({ dir: path.join(__dirname, name), example });
}

export default init;
