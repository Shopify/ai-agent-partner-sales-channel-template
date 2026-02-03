import {
  BlockStack,
  InlineStack,
  Page,
  Text,
  Box,
  Link,
} from "@shopify/polaris";
import { ExternalIcon } from "@shopify/polaris-icons";
import type { PartnerConfigSerializable } from "../config";
import { useTranslation } from "react-i18next";
import { ProductsPublishedCard } from "./ProductPublishingCard";
import { ProjectDetailsCard } from "./ProjectDetailsCard";
import { SupportCard } from "./SupportCard";
import type { ComponentProps } from "react";

interface HomePageProps {
  shop: string;
  partnerConfig: PartnerConfigSerializable;
  publishedProductsInfo:
    | ComponentProps<typeof ProductsPublishedCard>["publishedProductsInfo"]
    | null;
  partnerProjectLinks: {
    projectFrontendUrl: string | null;
    projectManagementUrl: string | null;
  };
}

export default function AppPage({
  shop,
  partnerConfig,
  publishedProductsInfo,
  partnerProjectLinks,
}: HomePageProps) {
  const { t } = useTranslation("LandingPage");
  const logo = partnerConfig.logo?.startsWith("<svg") ? (
    <div
      dangerouslySetInnerHTML={{
        __html: partnerConfig.logo.replace(
          "<svg",
          '<svg style="height: 16px; width: 16px;"',
        ),
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 0,
      }}
    />
  ) : (
    <img
      src={partnerConfig.logo}
      alt={partnerConfig.name}
      style={{
        height: "16px",
        width: "16px",
        objectFit: "contain",
      }}
    />
  );
  const title = (
    <InlineStack gap="200" blockAlign="center">
      {t("heading", { logo, partnerName: partnerConfig.name })}
    </InlineStack>
  );
  return (
    <Page
      title={title as unknown as string}
      primaryAction={{
        content: t("goTo", { partnerName: partnerConfig.name }),
        url: partnerConfig.docsUrl !== "#" ? partnerConfig.docsUrl : undefined,
        external: true,
        icon: ExternalIcon,
      }}
    >
      <BlockStack gap="500">
        {/* Partner Connection Details Card */}
        <ProjectDetailsCard
          shop={shop}
          partnerConfig={partnerConfig}
          partnerProjectLinks={partnerProjectLinks}
        />

        {/* Products Published Card */}
        {publishedProductsInfo ? (
          <ProductsPublishedCard
            partnerConfig={partnerConfig}
            publishedProductsInfo={publishedProductsInfo}
          />
        ) : null}

        {/* Support Section */}
        <SupportCard partnerConfig={partnerConfig} />

        {/* Footer - Terms and Conditions */}
        <Box paddingBlockStart="100" paddingBlockEnd="400">
          <InlineStack align="center">
            <Text as="span" variant="bodySm" tone="subdued">
              <Link url={partnerConfig.termsOfServiceUrl} external>
                {t("termsAndConditions", { partnerName: partnerConfig.name })}
              </Link>
            </Text>
          </InlineStack>
        </Box>
      </BlockStack>
    </Page>
  );
}
