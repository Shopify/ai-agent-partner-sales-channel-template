/**
 * Shopify GIDs look like: "gid://shopify/Product/1234567890"
 * This returns the object: { resource: "Product", id: "1234567890" }
 */
export function parseGid(gid: string) {
  const match = /^gid:\/\/shopify\/([^/]+)\/(.+)$/.exec(gid);
  if (!match) {
    return { resource: null, id: null };
  }
  const [, resource, id] = match;
  return { resource, id };
}
