import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the shopify.server module before importing PartnerProjectLinks
vi.mock("app/shopify.server", () => ({
  authenticate: {
    admin: vi.fn(),
  },
}));

import { PartnerProjectLinks } from "app/data/PartnerProjectLinks";

/**
 * These tests guard against shipping placeholder fallback URLs.
 * If any test fails, update app/data/PartnerProjectLinks.ts with your real URLs.
 */
describe("PartnerProjectLinks placeholder guard", () => {
  // Mock admin that returns no theme metafield, forcing the fallback path
  const mockAdmin = {
    graphql: vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        data: { shop: { metafield: null } },
      }),
    }),
  };

  const mockSession = {
    shop: "test-shop.myshopify.com",
    accessToken: "test-token",
  };

  it("getProjectFrontendUrl should not return a placeholder URL", async () => {
    const links = new PartnerProjectLinks({
      admin: mockAdmin,
      session: mockSession,
    } as any);

    const url = await links.getProjectFrontendUrl();

    expect(url).not.toContain("example.com");
    expect(url).not.toContain("example.app");
  });

  it("getProjectManagementUrl should not return a placeholder URL", async () => {
    const links = new PartnerProjectLinks({
      admin: mockAdmin,
      session: mockSession,
    } as any);

    const url = await links.getProjectManagementUrl();

    expect(url).not.toContain("example.com");
    expect(url).not.toContain("example.app");
  });
});
