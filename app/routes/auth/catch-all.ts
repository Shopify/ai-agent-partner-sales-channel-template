import type { Route } from "./+types/catch-all";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request }: Route.LoaderArgs) => {
  await authenticate.admin(request);

  return null;
};
