import type { Route } from "./+types/scopes_update";
import { authenticate } from "app/shopify.server";
import { db } from "app/db";
import { sessionTable } from "app/db/schema";
import { eq } from "drizzle-orm";

export const action = async ({ request }: Route.ActionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const current = payload.current as string[];
  if (session) {
    await db
      .update(sessionTable)
      .set({ scope: current.toString() })
      .where(eq(sessionTable.id, session.id));
  }
  return new Response();
};
