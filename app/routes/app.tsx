import type { Route } from "./+types/app";
import { useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";
import AppPage from "app/components/AppPage";
import { ProductsPublishing } from "app/data/ProductsPublishing";
import { config, getSerializableConfig } from "../config";
import { PartnerProjectLinks } from "app/data/PartnerProjectLinks";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: polarisStyles },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const admin = await authenticate.admin(request);
  const productsPublishing = new ProductsPublishing(admin);
  const partnerProjectLinks = new PartnerProjectLinks(admin);

  const [projectFrontendUrl, projectManagementUrl, publishedProductsInfo] =
    await Promise.all([
      partnerProjectLinks.getProjectFrontendUrl(),
      partnerProjectLinks.getProjectManagementUrl(),
      productsPublishing.getPublishedProductsCount(),
    ]);

  return {
    shop: admin.session.shop,
    partnerConfig: getSerializableConfig(config),
    partnerProjectLinks: {
      projectFrontendUrl,
      projectManagementUrl,
    },
    publishedProductsInfo: publishedProductsInfo ?? {
      publicationId: "1",
      count: 50,
      hasMore: false,
    },
  };
};

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <AppPage
      shop={loaderData.shop}
      partnerConfig={loaderData.partnerConfig}
      publishedProductsInfo={loaderData.publishedProductsInfo}
      partnerProjectLinks={loaderData.partnerProjectLinks}
    />
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: Route.HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
