import type { Route } from "./+types/AppLayout";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import { Outlet } from "react-router";
import { config } from "app/config";
import PolarisEn from "@shopify/polaris/locales/en.json";
import { getLocale } from "app/middleware/i18n";

const polarisLocale: Record<
  string,
  Promise<typeof PolarisEn> | typeof PolarisEn
> = {
  cs: import("@shopify/polaris/locales/cs.json"),
  da: import("@shopify/polaris/locales/da.json"),
  de: import("@shopify/polaris/locales/de.json"),
  en: PolarisEn,
  es: import("@shopify/polaris/locales/es.json"),
  fi: import("@shopify/polaris/locales/fi.json"),
  fr: import("@shopify/polaris/locales/fr.json"),
  it: import("@shopify/polaris/locales/it.json"),
  ja: import("@shopify/polaris/locales/ja.json"),
  ko: import("@shopify/polaris/locales/ko.json"),
  nb: import("@shopify/polaris/locales/nb.json"),
  nl: import("@shopify/polaris/locales/nl.json"),
  pl: import("@shopify/polaris/locales/pl.json"),
  "pt-BR": import("@shopify/polaris/locales/pt-BR.json"),
  "pt-PT": import("@shopify/polaris/locales/pt-PT.json"),
  sv: import("@shopify/polaris/locales/sv.json"),
  th: import("@shopify/polaris/locales/th.json"),
  tr: import("@shopify/polaris/locales/tr.json"),
  "zh-CN": import("@shopify/polaris/locales/zh-CN.json"),
  "zh-TW": import("@shopify/polaris/locales/zh-TW.json"),
};

export async function loader({ context }: Route.LoaderArgs) {
  const lang = getLocale(context);
  return {
    apiKey: config.publicApiKey,
    polarisLocale: (await polarisLocale[lang]) || polarisLocale["en"],
  };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  return (
    <AppProvider apiKey={loaderData.apiKey} embedded>
      <PolarisProvider i18n={loaderData.polarisLocale}>
        <Outlet />
      </PolarisProvider>
    </AppProvider>
  );
}
