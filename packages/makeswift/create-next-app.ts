import spawn from "cross-spawn";
import { coerceExampleToUrl } from "./utils";

export function createNextApp({
  dir,
  example,
}: {
  dir: string;
  example: string;
}): Promise<void> {
  const url = coerceExampleToUrl(example);

  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      ["--yes", "create-next-app", "--example", url, dir],
      { stdio: "inherit", cwd: __dirname }
    );

    child.on("close", (code) => {
      if (code !== 0)
        reject(
          new Error(`Failed to create Next.js app with exit code ${code}`)
        );
      else resolve();
    });
  });
}
