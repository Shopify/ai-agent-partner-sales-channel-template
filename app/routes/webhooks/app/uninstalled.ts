import type { Route } from "./+types/uninstalled";
import { authenticate } from "../../../shopify.server";
import { db } from "app/db";
import { sessionTable } from "app/db/schema";
import { eq } from "drizzle-orm";

export const action = async ({ request }: Route.ActionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    await db.delete(sessionTable).where(eq(sessionTable.shop, shop));
  }

  return new Response();
};
