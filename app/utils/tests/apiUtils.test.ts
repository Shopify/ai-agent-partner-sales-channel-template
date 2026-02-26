import { describe, it, expect } from "vitest";
import { parseGid } from "../apiUtils";

describe("parseGid", () => {
  it("Correctly parses a valid GID", () => {
    const gid = "gid://shopify/Publication/1";
    const { resource, id } = parseGid(gid);
    expect(resource).toBe("Publication");
    expect(id).toBe("1");
  });

  it("Correctly does not parse an invalid GID", () => {
    const badGid = "foo";
    const { resource, id } = parseGid(badGid);
    expect(resource).toBeNull();
    expect(id).toBeNull();
  });
});
