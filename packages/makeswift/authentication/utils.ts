import crypto from "crypto";

// most of this comes from the Auth0 docs
// https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#create-code-challenge

export function genRandom(size: number): Buffer {
  return crypto.randomBytes(size);
}

export function genRandomString(size: number): string {
  return genRandom(size).toString("hex");
}

export function sha256(value: Buffer): Buffer {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest();
}

export function encodeBase64(value: Buffer): string {
  return value
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export const logger = require("pino")();
