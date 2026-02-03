import i18next from "i18next";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import ShopifyFormat from "@shopify/i18next-shopify";

async function main() {
  const lang = document.documentElement.lang || "en";

  let translation;
  try {
    translation = await import(`./locales/${lang}/translation.json`);
  } catch {
    translation = await import(`./locales/en/translation.json`);
  }

  const shopifyFormat = new (ShopifyFormat.default ?? ShopifyFormat)();

  await i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .use(shopifyFormat)
    .init({
      debug: false,
      fallbackLng: "en",
      defaultNS: "translation",
      react: { useSuspense: false },
      detection: { order: ["htmlTag"], caches: [] },
      resources: {
        [lang]: translation,
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

main().catch((error) => console.error(error));
