import crypto from "crypto";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { verifyHmac, InvalidHmacError } from "../hmac.server";

const ORIGINAL_SECRET = process.env.SHOPIFY_API_SECRET;

// Helper to build a base set of params (without hmac)
function buildBaseParams(overrides: Record<string, string> = {}) {
  const params = new URLSearchParams();
  // Keep a deterministic insertion order for HMAC calculation
  params.append("shop", overrides.shop ?? "test-shop.myshopify.com");
  params.append(
    "timestamp",
    overrides.timestamp ?? String(Math.trunc(Date.now() / 1000)),
  );
  // Add any extra fields after required ones
  for (const [k, v] of Object.entries(overrides)) {
    if (k !== "shop" && k !== "timestamp") params.append(k, v);
  }
  return params;
}

function signParams(params: URLSearchParams, secret: string) {
  const digest = crypto
    .createHmac("sha256", secret)
    .update(params.toString())
    .digest("hex");
  const withHmac = new URLSearchParams(params);
  withHmac.append("hmac", digest);
  return { withHmac, digest };
}

describe("verifyHmac", () => {
  beforeEach(() => {
    process.env.SHOPIFY_API_SECRET = "test_secret";
  });

  afterEach(() => {
    if (ORIGINAL_SECRET === undefined) delete process.env.SHOPIFY_API_SECRET;
    else process.env.SHOPIFY_API_SECRET = ORIGINAL_SECRET;
  });

  it("throws when hmac is missing", () => {
    const params = buildBaseParams();
    expect(() => verifyHmac(params)).toThrowError(InvalidHmacError);
  });

  it("throws when timestamp is missing", () => {
    const params = new URLSearchParams();
    params.append("shop", "test-shop.myshopify.com");
    // Provide a valid-looking hmac to pass the initial check
    params.append("hmac", "0".repeat(64));
    expect(() => verifyHmac(params)).toThrowError(InvalidHmacError);
  });

  it("throws when timestamp is outside tolerance", () => {
    const params = new URLSearchParams();
    params.append("shop", "test-shop.myshopify.com");
    params.append("timestamp", "0"); // far in the past
    params.append("hmac", "0".repeat(64));
    expect(() => verifyHmac(params)).toThrowError(InvalidHmacError);
  });

  it("returns true with a valid hmac", () => {
    const base = buildBaseParams({ state: "nonce123" });
    const { withHmac } = signParams(base, process.env.SHOPIFY_API_SECRET!);
    expect(verifyHmac(withHmac)).toBe(true);
  });

  it("returns false with an invalid hmac", () => {
    const base = buildBaseParams({ state: "nonce123" });
    const { withHmac } = signParams(base, process.env.SHOPIFY_API_SECRET!);

    // Replace the hmac with a different valid hex string
    const tampered = new URLSearchParams(withHmac);
    tampered.set("hmac", "f".repeat(64));

    expect(verifyHmac(tampered)).toBe(false);
  });

  it("returns false when the hmac was created with a different secret", () => {
    const base = buildBaseParams({ state: "nonce123" });
    const { withHmac: tamperedHmac } = signParams(base, "different_secret");

    expect(verifyHmac(tamperedHmac)).toBe(false);
  });
});
