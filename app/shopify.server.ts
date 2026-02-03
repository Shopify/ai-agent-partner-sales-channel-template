import "@shopify/shopify-app-react-router/adapters/node";
import {
  shopifyApp,
  ApiVersion,
} from "@shopify/shopify-app-react-router/server";
import { DrizzleSessionStorageSQLite } from "@shopify/shopify-app-session-storage-drizzle";
import db from "./db";
import { sessionTable } from "./db/schema";

export const apiVersion = ApiVersion.April26;

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new DrizzleSessionStorageSQLite(db, sessionTable),
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
