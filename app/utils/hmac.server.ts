// Adapted from https://github.com/Shopify/shopify-app-js/blob/126d53f0cdbbcf8a5953d75ab45eb023419e2868/packages/apps/shopify-api/lib/utils/hmac-validator.ts#L72
import crypto from "crypto";

const HMAC_TIMESTAMP_PERMITTED_CLOCK_TOLERANCE_SEC = 90;

export function verifyHmac(_params: URLSearchParams) {
  const params = new URLSearchParams(_params);
  const hmac = params.get("hmac");

  if (!hmac) {
    throw new InvalidHmacError("Query does not contain an HMAC value.");
  }

  validateHmacTimestamp(params);

  params.delete("hmac");

  const digest = generateHmac(params, process.env.SHOPIFY_API_SECRET ?? "");

  return crypto.timingSafeEqual(
    Buffer.from(digest, "hex"),
    Buffer.from(hmac, "hex"),
  );
}

function validateHmacTimestamp(_params: URLSearchParams) {
  const params = new URLSearchParams(_params);
  const timestamp = params.get("timestamp");

  if (!timestamp) {
    throw new InvalidHmacError("Query does not contain a timestamp value.");
  }

  if (
    !timestamp ||
    Math.abs(Math.trunc(Date.now() / 1000) - Number(timestamp)) >
      HMAC_TIMESTAMP_PERMITTED_CLOCK_TOLERANCE_SEC
  ) {
    throw new InvalidHmacError(
      "HMAC timestamp is outside of the tolerance range",
    );
  }
}

export function generateHmac(params: URLSearchParams, secret: string) {
  const digest = crypto
    .createHmac("sha256", secret)
    .update(params.toString())
    .digest("hex");
  return digest;
}

export class InvalidHmacError extends Error {}
