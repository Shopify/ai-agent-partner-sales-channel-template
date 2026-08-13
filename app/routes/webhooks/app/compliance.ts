import type { Route } from "./+types/compliance";
import { authenticate } from "app/shopify.server";

export const action = async ({ request }: Route.ActionArgs) => {
  const { topic, shop } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  return new Response();
};
