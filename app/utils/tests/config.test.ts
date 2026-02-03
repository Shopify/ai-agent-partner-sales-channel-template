import { describe, it, expect } from "vitest";
import { config } from "app/config";

/**
 * These tests guard against shipping placeholder values.
 * If any test fails, update app/config.ts with your real values.
 */
describe("config placeholder guard", () => {
  it("name should not be the placeholder value", () => {
    expect(config.name).not.toBe("EZ Vibes");
  });

  it("supportUrl should not contain example.app", () => {
    expect(config.supportUrl).not.toContain("example.app");
  });

  it("docsUrl should not contain example.app", () => {
    expect(config.docsUrl).not.toContain("example.app");
  });

  it("afterAuthRedirectUrl should not contain example.app", () => {
    expect(config.afterAuthRedirectUrl).not.toContain("example.app");
  });

  it("termsOfServiceUrl should not contain example.app", () => {
    expect(config.termsOfServiceUrl).not.toContain("example.app");
  });
});
