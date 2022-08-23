import { createNextApp } from "./create-next-app";
import spawn from "cross-spawn";
import * as path from "path";
import * as http from "http";
import open from "open";
import * as fs from "fs";
import detectCb from "detect-port";
import { promisify } from "util";

const detect = promisify(detectCb);

const MAKESWIFT_APP = `http://localhost:7000`;
const siteSelectionPath = "select-site";

async function init(
  name: string,
  { example = "basic-typescript" }: { example?: string }
): Promise<void> {
  const nextAppDir = path.join(__dirname, name);
  createNextApp({
    dir: nextAppDir,
    example,
  });
  const handshakePort = await detect(5600);
  const nextAppPort = await detect(3000);

  const callbackUrl = `http://localhost:${handshakePort}/${siteSelectionPath}`;
  // Handshake Step 1
  const selectSiteUrl = new URL(`${MAKESWIFT_APP}/cli/select-site`);
  selectSiteUrl.searchParams.set("project_name", name);
  selectSiteUrl.searchParams.set("callback_url", callbackUrl);
  await open(selectSiteUrl.toString());

  // Handshake Step 2 - the browser goes to `callbackUrl`
  const nextAppUrl = `http://localhost:${nextAppPort}`;
  const redirectUrl = new URL(`${MAKESWIFT_APP}/cli/link-site`);
  redirectUrl.searchParams.set("host_url", nextAppUrl);

  // Handshake Step 3 - we redirect the browser to redirectUrl
  const { siteApiKey } = await getSiteApiKey({
    port: handshakePort,
    redirectUrl: redirectUrl.toString(),
  });

  // In the background, we're setting up the Next app with the API key
  // and starting the app at `nextAppPort`
  const envLocal = `MAKESWIFT_SITE_API_KEY=${siteApiKey}\n`;
  fs.writeFileSync(`${nextAppDir}/.env.local`, envLocal);

  spawn.sync("yarn", ["dev", "--port", nextAppPort.toString()], {
    stdio: "inherit",
    cwd: nextAppDir,
  });

  // Handshake Step 4 - Leo redirects to the builder with the site open,
  //                    with the host using `nextAppUrl` for the builder
}

async function getSiteApiKey({
  port,
  redirectUrl,
}: {
  port: number;
  redirectUrl: string;
}): Promise<{ siteApiKey: string }> {
  return new Promise<{ siteApiKey: string }>((resolve, reject) => {
    const server = http
      .createServer((req, res) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        if (url.pathname !== `/${siteSelectionPath}`) {
          reject(new Error("The CLI does not know how to handle that path."));
          return;
        }

        const queryParams = url.searchParams;
        const siteApiKey = queryParams.get("site_api_key");
        if (!siteApiKey) {
          reject(
            new Error("Select site redirect URL does not contain Site API Key.")
          );
          return;
        }

        res.writeHead(302, {
          Location: redirectUrl,
        });
        res.end();
        server.close();

        resolve({
          siteApiKey,
        });
      })
      .listen(port);
  });
}

export default init;
