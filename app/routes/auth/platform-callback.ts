import type { Route } from "./+types/platform-callback";
import { redirect } from "react-router";

import { verifyHmac, InvalidHmacError } from "../../utils/hmac.server";
import { config } from "app/config";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { afterAuthRedirectUrl, isStagingEnv } = config;

  try {
    const isValid = isStagingEnv || (await verifyHmac(url.searchParams));

    if (!isValid) {
      console.warn("HMAC validation failed");
      throw redirect("/auth/login");
    }

    const redirectTo = new URL(afterAuthRedirectUrl);
    redirectTo.search = url.search;

    return redirect(redirectTo.toString());
  } catch (error) {
    if (error instanceof InvalidHmacError) {
      console.warn(error);
    } else {
      console.error(error);
    }

    throw redirect("/auth/login");
  }
};
