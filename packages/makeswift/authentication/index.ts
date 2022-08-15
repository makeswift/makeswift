import open from "open";
import request from "request";
import express from "express";

import {
  encodeBase64,
  genRandom,
  genRandomString,
  logger,
  sha256,
} from "./utils";

export interface LoginConfig {
  timeout: number;
  port: number;
  auth0Domain: string;
  auth0ClientId: string;
  auth0TokenScope: string;
  auth0TokenAudience: string;
}

function validateConfig(config: LoginConfig) {
  if (typeof config !== "object") {
    throw new Error(`Config is required.`);
  }
  if (
    typeof config.port !== "number" ||
    config.port < 1 ||
    config.port > 65535
  ) {
    throw new Error(`Invalid port number in config.`);
  }
  if (typeof config.timeout !== "number" || config.timeout < 0) {
    throw new Error(`Invalid timeout value.`);
  }
  if (typeof config.auth0Domain !== "string") {
    throw new Error(`Invalid auth0Domain string.`);
  }
  if (typeof config.auth0ClientId !== "string") {
    throw new Error(`Invalid auth0ClientId string.`);
  }
  if (typeof config.auth0TokenScope !== "string") {
    throw new Error(`Invalid auth0TokenScope string.`);
  }
  if (typeof config.auth0TokenAudience !== "string") {
    throw new Error(`Invalid auth0TokenAudience string.`);
  }
}

function getAuthenticationUrl({
  config,
  codeChallenge,
  state,
  path,
}: {
  config: LoginConfig;
  codeChallenge: string;
  state: string;
  path: string;
}): string {
  logger.info({ codeChallenge, state }, "Getting authentication URL.");

  return [
    `https://${config.auth0Domain}/authorize`,
    `?response_type=code`,
    `&code_challenge=${codeChallenge}`,
    `&code_challenge_method=S256`,
    `&client_id=${config.auth0ClientId}`,
    `&redirect_uri=http://localhost:${config.port}/${path}`,
    `&scope=${encodeURI(config.auth0TokenScope)}`,
    `&audience=${config.auth0TokenAudience}`,
    `&state=${state}`,
  ].join("");
}

export async function login(config: LoginConfig) {
  validateConfig(config);

  const codeVerifier = encodeBase64(genRandom(32));
  const csrfToken = genRandomString(16);
  const codeChallenge = encodeBase64(sha256(Buffer.from(codeVerifier)));

  const authenticationUrl = getAuthenticationUrl({
    config,
    codeChallenge,
    state: csrfToken,
    path: "cli-auth",
  });

  logger.info({ authenticationUrl }, "Opening the authentication URL for you");
  await open(authenticationUrl);

  // now, start server
  const app = express();
  const port = 42225;

  async function handleBrowserResponse(request: any, response: any) {
    const queryStringParams = request.query;

    const { code, state } = queryStringParams;

    if (state !== csrfToken) {
      throw Error("Invalid CSRF token, can not proceed.");
    }

    response.redirect(302, "https://app.staging.makeswift.com");

    await getToken(config, codeVerifier, code);
  }

  app.get("/cli-auth", handleBrowserResponse);
  app.listen(port);
}

async function getToken(
  config: LoginConfig,
  codeVerifier: string,
  code: string
): Promise<any> {
  const requestParams = {
    url: `https://${config.auth0Domain}/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    form: {
      grant_type: "authorization_code",
      client_id: config.auth0ClientId,
      code_verifier: codeVerifier,
      code: code,
      // this is needed
      redirect_uri: `http://localhost:${config.port}`,
    },
  };

  // @note: For some reason, this `request` library has been difficult to replace..
  //        I've tried converting this to Axios, I get stuck getting access denied.
  //        Let's revisit at some point.
  request.post(requestParams, (err, response) => {
    if (err != null) {
      throw err;
    }

    const body = JSON.parse(response.body);
    const accessToken = body.access_token;

    logger.info({ accessToken }, "final response");
  });
}
