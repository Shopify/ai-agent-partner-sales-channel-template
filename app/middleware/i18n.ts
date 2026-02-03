import { initReactI18next } from "react-i18next";
import { createCookie } from "react-router";
import { createI18nextMiddleware } from "remix-i18next/middleware";
import resources from "app/locales"; // Import your locales
import ShopifyFormat from "@shopify/i18next-shopify";
import "i18next";

// This cookie will be used to store the user locale preference
export const localeCookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
});

const supportedLocales = Object.keys(resources).filter(
  (locale) => locale !== "en",
);

const shopifyFormat = new (ShopifyFormat.default ?? ShopifyFormat)();

export const [i18nextMiddleware, getLocale, getInstance] =
  createI18nextMiddleware({
    detection: {
      supportedLanguages: [...supportedLocales, "en"], // Your supported languages, the fallback should be last
      fallbackLanguage: "en",
      cookie: localeCookie, // The cookie to store the user preference
    },
    i18next: { resources },
    plugins: [initReactI18next, shopifyFormat],
  });

// This adds type-safety to the `t` function
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: typeof resources.en;
  }
}
