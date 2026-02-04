import { authenticate } from "app/shopify.server";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  const admin = await authenticate.admin(request);
  return admin.redirect("/app");
}
